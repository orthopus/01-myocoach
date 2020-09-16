import sys
from PyQt5 import QtWidgets
from PyQt5 import QtGui
from PyQt5 import QtCore

SCREEN_WIDTH            = 800
SCREEN_HEIGHT           = 600
PLAYER_SPEED            = 3   # pix/frame
PLAYER_BULLET_X_OFFSETS = [10,55]
PLAYER_BULLET_Y         = 15
BULLET_SPEED            = 10  # pix/frame
BULLET_FRAMES           = 50
FRAME_TIME_MS           = 16  # ms/frame

from FlappyBird import FlappyBird

class TestFlappyBird(QtWidgets.QWidget):
    def __init__(self):
        super(TestFlappyBird, self).__init__()
        self.initUI()
        self.velocity = 0.0

        self.timer = QtCore.QTimer()
        self.timer.timeout.connect(self.update)
        self.timer.start(40)

    def initUI(self):

        self.flappyBird = FlappyBird(self)
        self.setFocusPolicy(QtCore.Qt.StrongFocus) # get key up event
        self.mainLayout = QtWidgets.QVBoxLayout(self)
        self.mainLayout.addWidget(self.flappyBird)

        self.velLabel = QtWidgets.QLabel("0.0")
        self.mainLayout.addWidget(self.velLabel)

    def update(self):
        self.flappyBird.update(0.0, self.velocity)
        self.velLabel.setText(str(self.velocity))

    def keyPressEvent(self, event):
        if event.key() == QtCore.Qt.Key_Up:
            self.velocity += 20
        elif event.key() == QtCore.Qt.Key_Down:
            self.velocity -= 20
        event.accept()

if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    ex = TestFlappyBird()
    ex.show()
    sys.exit(app.exec_())
