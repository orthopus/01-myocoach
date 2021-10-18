import * as React from "react";
import AppBar, {AppBarProps} from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import {NavLink, NavLinkProps} from "react-router-dom";
import useTheme from "@mui/material/styles/useTheme";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import OctoIcon from "../icons/OctoIcon";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import styled from "@mui/material/styles/styled";

/*
    MyoCoach frontend desktop navigation bar component
    ==================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

const StyledAppBar = styled(AppBar)<AppBarProps>(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
}));

const StyledNavLink = styled(NavLink)<NavLinkProps>(() => ({
    color: "inherit",
    textDecoration: "inherit",
}));

const NavLinkSeparator = styled('div')(() => ({
    flexGrow: 1,
}));

const DesktopAppBar: React.FC<{ gameList: Array<GameDescription>, serverConnected: boolean, sensorsConnected: boolean,
    onToggleFullscreenEvent: () => void, onToggleDarkModeEvent: () => void }> =
    ({ gameList, serverConnected, sensorsConnected,
         onToggleFullscreenEvent, onToggleDarkModeEvent }) => {

        const theme = useTheme();

        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const [gameMenuAnchorEl, setGameMenuAnchorEl] = React.useState<null | HTMLElement>(null);
        const menuOpen = Boolean(anchorEl);
        const gameMenuOpen = Boolean(gameMenuAnchorEl);

        function handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
            setAnchorEl(event.currentTarget);
        }

        function handleCloseMenu() {
            setAnchorEl(null);
        }

        function handleOpenGameMenu(event: React.MouseEvent<HTMLElement>) {
            setGameMenuAnchorEl(event.currentTarget);
        }

        function handleCloseGameMenu() {
            setGameMenuAnchorEl(null);
        }

        return (
            <StyledAppBar position={"fixed"}>
                <Toolbar>
                    <StyledNavLink to={'/'}>
                        <Button color="inherit">Signal</Button>
                    </StyledNavLink>
                    <StyledNavLink to={'/training'}>
                        <Button color="inherit">Training</Button>
                    </StyledNavLink>
                    <div>
                        <StyledNavLink to={'#'}>
                            <Button aria-controls="game-menu" aria-haspopup="true"
                                    onClick={handleOpenGameMenu} color="inherit">Games</Button>
                        </StyledNavLink>
                        <Menu id="game-menu-appbar" anchorEl={gameMenuAnchorEl}
                              anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                              }}
                              keepMounted
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                              }}
                              open={gameMenuOpen}
                              onClose={handleCloseGameMenu}>
                            {
                                gameList.map((description: GameDescription) =>
                                    <StyledNavLink key={description.url} to={description.url}>
                                        <MenuItem onClick={handleCloseGameMenu}>{description.name}</MenuItem>
                                    </StyledNavLink>
                                )
                            }
                        </Menu>
                    </div>
                    <StyledNavLink to={'/about'}>
                        <Button color="inherit">About</Button>
                    </StyledNavLink>

                    <NavLinkSeparator/>
                    <Box padding={1}>
                        <IconButton edge="end"
                                    aria-label="menu icon button"
                                    aria-haspopup="true"
                                    color={"inherit"} onClick={onToggleDarkModeEvent}>
                            {
                                theme.palette.mode == "dark" ?
                                    (<Tooltip title={"Light Mode"}>
                                        <Brightness7Icon/>
                                    </Tooltip>) :
                                    (<Tooltip title={"Dark Mode"}>
                                        <Brightness4Icon/>
                                    </Tooltip>)
                            }
                        </IconButton>
                    </Box>
                    { document.fullscreenEnabled ?
                        <Box padding={1}>
                            <IconButton edge="end"
                                        aria-label="menu icon button"
                                        aria-haspopup="true"
                                        color={"inherit"} onClick={onToggleFullscreenEvent}>
                                {
                                    !document.fullscreenElement ?
                                        (<Tooltip title={"Enter Fullscreen"}>
                                            <Fullscreen/>
                                        </Tooltip>) :
                                        (<Tooltip title={"Exit Fullscreen"}>
                                            <FullscreenExit/>
                                        </Tooltip>)
                                }
                            </IconButton>
                        </Box> : null
                    }
                    <Box padding={1}>
                        {
                            serverConnected ?
                                (<Tooltip title={"Server connected"}>
                                    <WifiIcon style={{color: theme.palette.success.main}}/>
                                </Tooltip>) : (<Tooltip title={"Server not connected"}>
                                    <WifiOffIcon style={{color: theme.palette.warning.main}}/>
                                </Tooltip>)
                        }
                    </Box>
                    <Box padding={1}>
                        {
                            sensorsConnected ?
                                (<Tooltip title={"Sensors connected"}>
                                    <PowerIcon style={{color: theme.palette.success.main}}/>
                                </Tooltip>) : (<Tooltip title={"Sensors not connected"}>
                                    <PowerOffIcon style={{color: theme.palette.warning.main}}/>
                                </Tooltip>)
                        }
                    </Box>
                    <div>
                        <IconButton edge="end"
                                    aria-label="menu icon button"
                                    aria-haspopup="true"
                                    color={"inherit"} onClick={handleOpenMenu}>
                            <OctoIcon/>
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorEl}
                              anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              keepMounted
                              transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                              }}
                              open={menuOpen}
                              onClose={handleCloseMenu}>
                            <StyledNavLink to={"/settings"}>
                                <MenuItem onClick={handleCloseMenu}>
                                    Settings
                                </MenuItem>
                            </StyledNavLink>
                        </Menu>
                    </div>
                </Toolbar>
            </StyledAppBar>
        );
    }

export default DesktopAppBar;