"""
    FlappyBird Widget
    ============

    This class create a derivative clone of the FlappyBird Game !

    In the context of the MyoCoach, the game play of original
    FlappyBird is change but the sprites is the same
     - The bird don't fall when no user input !
     - EMG 0 move the bird up (velocity control)
     - EMG 1 move the bird down
     - The Scene velocity increase every 10 points
     - Use SPACEBAR to start and restartGame

    The game is composed of 3 screen
     - Welcome
     - Main Game
     - Game Over

    Author: David Gouaillier
    Website: orthopus.com
    Last edited: March 2019
"""

from PyQt5 import QtWidgets
from PyQt5 import QtGui
from PyQt5 import QtCore
from PyQt5.QtMultimedia import QSound

import random
from itertools import cycle
import sys

DEBUG = False

# The Widget Size is fixed due to background game sprites
SCREENWIDTH  = 288
SCREENHEIGHT = 512
# Pipe static definition (based on sprites)
PIPEGAPSIZE  = 100 # gap between upper and lower part of pipe
PIPEWIDTH    = 52
PIPEHEIGHT   = 320
# Define the base (ground) position on screen
BASEY        = SCREENHEIGHT * 0.79
# Define the initial scene velocity in Pixel
INITSCENEVEL = 6
# sound dicts
SOUNDS = {}

# list of all possible players sprites(tuple of 3 positions of flap)
PLAYERS_LIST = (# red bird
                ('Widget/Game/FlappyBird/assets/sprites/redbird-upflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/redbird-midflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/redbird-downflap.png'),
                # blue bird
                ('Widget/Game/FlappyBird/assets/sprites/bluebird-upflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/bluebird-midflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/bluebird-downflap.png'),
                # yellow bird
                ('Widget/Game/FlappyBird/assets/sprites/yellowbird-upflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/yellowbird-midflap.png',
                 'Widget/Game/FlappyBird/assets/sprites/yellowbird-downflap.png'))

# list of backgrounds  sprites
BACKGROUNDS_LIST = ('Widget/Game/FlappyBird/assets/sprites/background-day.png',
                    'Widget/Game/FlappyBird/assets/sprites/background-night.png')

# list of pipes sprites
PIPES_LIST = (# green pipe
              ( 'Widget/Game/FlappyBird/assets/sprites/greenpipe-down.png',
                'Widget/Game/FlappyBird/assets/sprites/greenpipe-up.png'),
              # red pipe
              ('Widget/Game/FlappyBird/assets/sprites/redpipe-down.png',
               'Widget/Game/FlappyBird/assets/sprites/redpipe-up.png'))

# list of score sprites
SCORE_LIST = (  'Widget/Game/FlappyBird/assets/sprites/0.png',
                'Widget/Game/FlappyBird/assets/sprites/1.png',
                'Widget/Game/FlappyBird/assets/sprites/2.png',
                'Widget/Game/FlappyBird/assets/sprites/3.png',
                'Widget/Game/FlappyBird/assets/sprites/4.png',
                'Widget/Game/FlappyBird/assets/sprites/5.png',
                'Widget/Game/FlappyBird/assets/sprites/6.png',
                'Widget/Game/FlappyBird/assets/sprites/7.png',
                'Widget/Game/FlappyBird/assets/sprites/8.png',
                'Widget/Game/FlappyBird/assets/sprites/9.png')

# A simple function that load a PNG file into a QGraphic Item
def loadPixmap(imagePNG):
    return QtWidgets.QGraphicsPixmapItem(QtGui.QPixmap(imagePNG))

class FlappyBird(QtWidgets.QWidget):
    """ The Main class of the game
         - load Sprites of the game
         - manage input (emg and keyboard)
         - manage the 3 different screen and state machine to
           change them
         - check for collision
         - update other class (base, pipes, player, score)
    """
    def __init__(self, parent):
        super(FlappyBird, self).__init__()
        self.parent = parent

        self.sceneVel = INITSCENEVEL
        self.lowerAndUpperPipeList = []
        self.pipeTiming = 0
        self.crash = False
        self.spaceBarPushed = False

        self.initStaticGameSprites()
        self.initUI()


    def initStaticGameSprites(self):
        """ preload static sprites and Sound """
        # game over sprite
        self.gameOver = loadPixmap('Widget/Game/FlappyBird/assets/sprites/gameover.png')
        # message sprite for welcome screen
        self.welcomeMessage = loadPixmap('Widget/Game/FlappyBird/assets/sprites/message.png')

        # sounds
        if 'win' in sys.platform:
         soundExt = '.wav'
        else:
         soundExt = '.ogg'

        if DEBUG:
            print("Plateform : ",sys.platform)
            print("Sound extension : ", soundExt)

        SOUNDS['die']    = QSound('Widget/Game/FlappyBird/assets/audio/die' + soundExt)
        SOUNDS['hit']    = QSound('Widget/Game/FlappyBird/assets/audio/hit' + soundExt)
        SOUNDS['point']  = QSound('Widget/Game/FlappyBird/assets/audio/point' + soundExt)
        SOUNDS['level-up'] = QSound('Widget/Game/FlappyBird/assets/audio/level-up' + soundExt)
        SOUNDS['wing']   = QSound('Widget/Game/FlappyBird/assets/audio/wing' + soundExt)


    def initUI(self):
        layout = QtWidgets.QHBoxLayout(self)

        self.gameState = 0

        # use of QTGraphicScene to manage sprites
        self.scene = QtWidgets.QGraphicsScene(self.parent)
        self.scene.view = QtWidgets.QGraphicsView(self.scene)
        self.scene.view.setStyleSheet("assets/background-color:transparent;")
        self.scene.view.setFixedSize(SCREENWIDTH, SCREENHEIGHT)
        # prevent Event key and mouse to move scene into widget
        self.scene.view.setDragMode(QtWidgets.QGraphicsView.NoDrag)
        self.scene.view.setFocusPolicy(QtCore.Qt.NoFocus)
        self.scene.view.setHorizontalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)
        self.scene.view.setVerticalScrollBarPolicy(QtCore.Qt.ScrollBarAlwaysOff)

        self.setFocusPolicy(QtCore.Qt.StrongFocus) # get key up event

        # the first screen is the Welcom one !
        self.initWelcomeScreen()

        layout.addWidget(self.scene.view)

    def initWelcomeScreen(self):
        """ Define the Welcome screen
             - Random choice of player (color)
             - random choice and load of background
             - load welcommessage sprites
             - initiate class player and base
         """
        # Variable re-initialisation
        self.sceneVel = INITSCENEVEL
        self.pipeTiming = 0
        # Remove Pipe class
        for i, pipe in reversed(list(enumerate(self.lowerAndUpperPipeList))):
            del self.lowerAndUpperPipeList[i]

        # select random background sprites and add it to the scene
        randBg = random.randint(0, len(BACKGROUNDS_LIST) - 1)
        self.background = loadPixmap(BACKGROUNDS_LIST[randBg])
        self.scene.addItem(self.background)

        # show Welcom Message sprites and add it to the scene
        messageX = int((SCREENWIDTH - self.welcomeMessage.pixmap().width()) / 2)
        messageY = int(SCREENHEIGHT * 0.12)
        self.scene.addItem(self.welcomeMessage)
        self.welcomeMessage.setPos(messageX, messageY)

        # load Base class and add it to the scene
        self.base = Base(self)
        self.scene.addItem(self.base)

        # load Base class and add it to the scene
        self.player = Player(self)
        self.scene.addItem(self.player)

    def initMainGame(self):
        """ Initialize Main Game screen """
        # remove Welcome Message sprites
        self.scene.removeItem(self.welcomeMessage)
        # Add a new Pipes couple by loading the class
        self.lowerAndUpperPipeList.append(LowerAndUpperPipe(self))
        # load the Score class
        self.score = Score(self)

    def updateMainGame(self):
        """ Update Main Game screen
             - Manage Pipes
             - Check for Collision
             - Update Score
        """
        # the pipeTiming counter is use to determine
        # the pipe apparition frequence
        self.pipeTiming += 1
        if(self.pipeTiming % int(240/self.sceneVel) == 0):
            self.pipeTiming = 0
            self.lowerAndUpperPipeList.append(LowerAndUpperPipe(self))
        # delete pipe class if pipe out of screen
        for i,lowerAndUpperPipe in enumerate(self.lowerAndUpperPipeList):
            if(lowerAndUpperPipe.outOfScreen()):
                del self.lowerAndUpperPipeList[i]
        # Update all pipe position
        for lowerAndUpperPipe in self.lowerAndUpperPipeList:
            lowerAndUpperPipe.update()

        # Check Collision
        # with base
        if(self.player.collidesWithItem(self.base)):
            self.crash = True
        # with pipe
        for lowerAndUpperPipe in self.lowerAndUpperPipeList:
            if(self.player.collidesWithItem(lowerAndUpperPipe.getUpperPipePixmap()) or
               self.player.collidesWithItem(lowerAndUpperPipe.getLowerPipePixmap()) ):
                self.crash = True
                SOUNDS['hit'].play()
        # GAME CHEATS : I don't check collision with sky, so if player
        #               go up to Pipes sprites, no more collision !!
        # Update Score Sprites
        self.score.update()

    def initGameOverScreen(self):
        """ Initialize Game Over screen """
        # add the game Over Sprites
        self.scene.addItem(self.gameOver)
        self.gameOver.setPos(SCREENWIDTH/2.0 - self.gameOver.pixmap().width()/2.0,
                             SCREENHEIGHT/2.0 - self.gameOver.pixmap().height()/2.0)
        SOUNDS['die'].play()

    def keyPressEvent(self, event):
        """ Catch the Key Space pressed event """
        if event.key() == QtCore.Qt.Key_Space:
            if(self.gameState == 0 or self.gameState == 2):
                self.spaceBarPushed = True
        event.accept()

    def update(self, emg0_Value, emg1_Value):
        """ Main Update of FallpyBird, call by the MyoCoach class
             - Get the EMG Value [0 -> 100] and compute player velocity
             - manage the Gale StATE MACHINE
        """
        self.velPlayer = (emg1_Value - emg0_Value)

        if DEBUG:
            print("Main: update")

        # WELCOME SCREEN MODE
        if(self.gameState == 0 and self.spaceBarPushed):
            self.initMainGame()
            self.spaceBarPushed = False
            self.gameState = 1
        # MAIN GAME MODE
        elif(self.gameState == 1 and self.crash):
            self.initGameOverScreen()
            self.gameState = 2
        # GAME OVER MODE
        elif(self.gameState == 2 and self.spaceBarPushed):
            self.initWelcomeScreen()
            self.scene.removeItem(self.gameOver)
            self.crash = False
            self.spaceBarPushed = False
            self.gameState = 0

        self.player.update()
        if(self.gameState == 1):
            self.base.update()
            self.updateMainGame()

        if DEBUG:
             print("change state : ",self.gameState)

class Score(QtWidgets.QGraphicsPixmapItem):
    """ The Score class of the game
        - manage Sprites and show score
        - update score (player pos vs Pipe pos)
        - play sound
        - manage LEVEL UP (score %10)
    """
    def __init__(self, parent):
        super(Score, self).__init__()
        self.parent = parent

        self.scoreSprites = []
        self.scoreDigits = []
        self.score = 0
        self.showScore()

    def showScore(self):
        """ function to display score sprites on scene"""
        # remove Old Sprites
        for i in range(len(self.scoreDigits)):
            self.parent.scene.removeItem(self.scoreSprites[i])
        self.scoreSprites = []
        # get the score digit ex : ["1", "0"] for 10
        self.scoreDigits = [int(x) for x in list(str(self.score))]
        # Compute score Sprites Width on scene
        totalWidth = 0
        for digit in self.scoreDigits:
            totalWidth += 24
        Xoffset = (SCREENWIDTH - totalWidth) / 2
        # Add score sprites on scene
        for i, digit in enumerate(self.scoreDigits):
            tmpScore = QtWidgets.QGraphicsPixmapItem()
            tmpScore.setPixmap(QtGui.QPixmap(SCORE_LIST[digit]))
            self.scoreSprites.append(tmpScore)
            self.parent.scene.addItem(self.scoreSprites[i])
            self.scoreSprites[i].setPos(Xoffset, SCREENHEIGHT * 0.1)
            Xoffset += self.scoreSprites[i].pixmap().width()

    def update(self):
        """ function call by FallpyBird class every game cycle"""
        # get player position
        playerMidPos = self.parent.player.getMiddlePos()
        # for each pipes
        for pipe in self.parent.lowerAndUpperPipeList:
            # get pipes position
            pipeMidPos = pipe.getMiddlePos()
            # check if player pass the pipes
            if pipeMidPos <= playerMidPos < pipeMidPos + self.parent.sceneVel:
                # if yes increase score
                self.score += 1
                # update score sprites
                self.showScore()
                # every 10 points, the scene volcities increase
                if(self.score % 10 == 0 and self.score != 0):
                    self.parent.sceneVel += 1
                    SOUNDS['level-up'].play()
                else:
                    SOUNDS['point'].play()


class LowerAndUpperPipe():
    """ This class manage the lower and Upper pipes
        - random color and hole position
        - update position
        - define function to acces class member (upperPipe pos, poutOfscreen...)
    """
    def __init__(self, parent):
        super(LowerAndUpperPipe, self).__init__()
        self.parent = parent
        # get a pipe couple with random hole position
        self.newPipes = self.getRandomPipe()
        # select random pipe sprites (color)
        self.randPipe = random.randint(0, len(PIPES_LIST) - 1)

        # Load Upper Pipes Sprites
        self.UpperPipe = QtWidgets.QGraphicsPixmapItem()
        self.UpperPipe.setPixmap(QtGui.QPixmap(PIPES_LIST[self.randPipe][0]))
        self.UpperPipe.setPos(self.newPipes[0]['x'], self.newPipes[0]['y'])
        self.parent.scene.addItem(self.UpperPipe)
        # Load Lower Pipes Sprites
        self.LowerPipe = QtWidgets.QGraphicsPixmapItem()
        self.LowerPipe.setPixmap(QtGui.QPixmap(PIPES_LIST[self.randPipe][1]))
        self.LowerPipe.setPos(self.newPipes[1]['x'], self.newPipes[1]['y'])
        self.parent.scene.addItem(self.LowerPipe)

    def getRandomPipe(self):
        """returns a randomly generated pipe"""
        # y of gap between upper and lower pipe
        gapY = random.randrange(0, int(BASEY * 0.6 - PIPEGAPSIZE))
        gapY += int(BASEY * 0.2)
        pipeHeight = PIPEHEIGHT
        pipeX = SCREENWIDTH + 10

        return [ {'x': pipeX, 'y': gapY - pipeHeight},  # upper pipe
                {'x': pipeX, 'y': gapY + PIPEGAPSIZE}] # lower pipe

    def outOfScreen(self):
        """Check if pipes is out screen (to remove it)"""
        if(self.newPipes[0]['x'] < -PIPEWIDTH):
            return True

    def getMiddlePos(self):
        """function use in score class"""
        return self.newPipes[0]['x'] + PIPEWIDTH / 2.0

    def getUpperPipePixmap(self):
        """get pixmap for collision detection"""
        return self.UpperPipe

    def getLowerPipePixmap(self):
        """get pixmap for collision detection"""
        return self.LowerPipe

    def update(self):
        """ function call by FallpyBird class every game cycle"""
        # move pipes on scene
        self.newPipes[0]['x'] -= self.parent.sceneVel
        self.newPipes[1]['x'] -= self.parent.sceneVel
        self.UpperPipe.setPos(self.newPipes[0]['x'], self.newPipes[0]['y'])
        self.LowerPipe.setPos(self.newPipes[1]['x'], self.newPipes[1]['y'])

    def __del__(self):
        # remove item on scene when pipes class is deleted
        self.parent.scene.removeItem(self.UpperPipe)
        self.parent.scene.removeItem(self.LowerPipe)

class Base(QtWidgets.QGraphicsPixmapItem):
    """ This class manage the base
        - update base position to give a velocity special effect
    """
    def __init__(self, parent):
        super(Base, self).__init__()
        self.parent = parent
        self.baseX = 0

        self.setPixmap(QtGui.QPixmap('Widget/Game/FlappyBird/assets/sprites/base.png'))
        # amount by which base can maximum shift to left
        self.baseShift = self.pixmap().width() - SCREENWIDTH
        self.setPos(self.baseX, BASEY)

    def update(self):
        """ function call by FallpyBird class every game cycle"""
        self.baseX = -((-self.baseX + self.parent.sceneVel) % self.baseShift)
        self.setPos(self.baseX, BASEY)


class Player(QtWidgets.QGraphicsPixmapItem):
    """ This class manage the player (bird)
        - random bird sprites (color)
        - manage wing flap (different sprites)
        - behavior dependant of game STATE
    """
    def __init__(self, parent):
        super(Player, self).__init__()
        self.parent = parent
        # index of player to flap on screen
        self.indexPlayer = 0
        self.indexPlayerGen = cycle([0, 1, 2, 1])
        self.loopIter = 0
        # player shm for up-down motion on welcome screen
        self.playerShmVals = {'val': 0, 'dir': 1}

        self.playerX = int(SCREENWIDTH * 0.2)
        self.playerY = int((SCREENHEIGHT - self.pixmap().height()) / 2.0)
        # select random player sprites
        self.randPlayer = random.randint(0, len(PLAYERS_LIST) - 1)
        self.setPlayerPixmap()
        self.initPlayerPos()

    def initPlayerPos(self):
        self.setPos(self.playerX, self.playerY)

    def getMiddlePos(self): # for score
        return self.playerX + self.pixmap().width() / 2.0

    # load the good Pixmap to emulate bird flap
    def setPlayerPixmap(self):
        if (self.loopIter + 1) % 5 == 0:
            self.indexPlayer = next(self.indexPlayerGen)
        self.loopIter = (self.loopIter + 1) % 30
        self.setPixmap(QtGui.QPixmap(PLAYERS_LIST[self.randPlayer][self.indexPlayer]))

    def playerShm(self):
        # oscillates the value of playerShm['val'] between 8 and -8
        if abs(self.playerShmVals['val']) == 8:
            self.playerShmVals['dir'] *= -1

        if self.playerShmVals['dir'] == 1:
            self.playerShmVals['val'] += 1
        else:
            self.playerShmVals['val'] -= 1

    def update(self):
        """ function call by FallpyBird class every game cycle
             - The bird have differnet behavior in function of game State
        """
        if DEBUG:
            print("Player: update")
        # Welcom Screen : the bird oscillate indefinitly
        if(self.parent.gameState == 0):
            self.setPlayerPixmap()
            self.playerShm()
            self.playerYModif = self.playerShmVals['val']
        # Main Screen : the bird react to emg signal (velPlayer variable)
        elif(self.parent.gameState == 1):
            self.setPlayerPixmap()
            self.playerYModif += self.parent.velPlayer * 0.15
            self.setRotation(self.parent.velPlayer*0.45)
            if(abs(self.parent.velPlayer) > 70.0):
                SOUNDS['wing'].play()
        # Game Over Screen : the rotate and fall to the ground
        elif(self.parent.gameState == 2):
            if(self.playerY+self.playerYModif < BASEY - 30):
                self.playerYModif += 10
                self.setRotation(65)

        self.setPos(self.playerX, self.playerY + self.playerYModif)
