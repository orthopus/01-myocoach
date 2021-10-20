import * as React from 'react';
import IconButton from "@mui/material/IconButton";
import MuiDrawer, {DrawerProps} from "@mui/material/Drawer";
import List from "@mui/material/List";
import {NavLink, NavLinkProps} from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import {LinkProps} from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import {CSSObject, Theme} from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ShowChart from "@mui/icons-material/ShowChart";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Info from "@mui/icons-material/Info";
import SportsEsports from "@mui/icons-material/SportsEsports";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import Settings from "@mui/icons-material/Settings";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import styled from "@mui/material/styles/styled";

/*
    MyoCoach frontend mobile navigation drawer component
    ====================================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */

interface ListItemLinkProps extends LinkProps {
    name: string;
    open?: boolean;
    onClick?: () => void;
}

function ListItemLink(props: Omit<ListItemLinkProps, 'ref'>) {
    const { name, open, onClick } = props;

    return (
        <Tooltip title={name}>
            <ListItem button onClick={onClick}>
                <ListItemIcon><SportsEsports/></ListItemIcon>
                <ListItemText primary={name} />
                { open != null ? open ? <ExpandLess /> : <ExpandMore /> : null }
            </ListItem>
        </Tooltip>
    );
}

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })<DrawerProps>(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        backgroundColor: theme.palette.primary.main,
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

const ToolbarWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
}));

const StyledNavLink = styled(NavLink)<NavLinkProps>(() => ({
    color: "inherit",
    textDecoration: "inherit",
}));

const MobileDrawer: React.FC<{ gameList: Array<GameDescription>, serverConnected: boolean, sensorsConnected: boolean,
    onToggleFullscreenEvent: () => void, onToggleDarkModeEvent: () => void }> =
    ({ gameList, serverConnected, sensorsConnected,
         onToggleFullscreenEvent, onToggleDarkModeEvent }) => {

        const theme = useTheme();

        const [openDrawerGameMenu, setOpenDrawerGameMenu] = React.useState(false);

        const [open, setOpen] = React.useState(false);

        const handleDrawerOpen = () => {
            setOpen(true);
        };

        const handleDrawerClose = () => {
            setOpen(false);
            setOpenDrawerGameMenu(false);
        };

        function handleToogleDrawerGameMenuClick() {
            if(openDrawerGameMenu) {
                setOpenDrawerGameMenu(false);
            } else {
                setOpen(true);
                setOpenDrawerGameMenu(true);
            }
        }

        return (<React.Fragment>
            <Drawer variant={"permanent"} open={open}>
                <ToolbarWrapper>
                    { open ? <IconButton onClick={handleDrawerClose}>
                            <MenuOpenIcon/>
                        </IconButton>
                        : <IconButton onClick={handleDrawerOpen}>
                            <MenuIcon/>
                        </IconButton> }
                </ToolbarWrapper>
                <Divider />
                <List>
                    <Tooltip title={"Signal"}>
                        <StyledNavLink to={'/'}>
                            <ListItem button onClick={handleDrawerClose}>
                                <ListItemIcon><ShowChart/></ListItemIcon>
                                <ListItemText primary={"Signal"}/>
                            </ListItem>
                        </StyledNavLink>
                    </Tooltip>
                    <Tooltip title={"Training"}>
                        <StyledNavLink to={'/training'}>
                            <ListItem button onClick={handleDrawerClose}>
                                <ListItemIcon><FitnessCenter/></ListItemIcon>
                                <ListItemText primary={"Training"}/>
                            </ListItem>
                        </StyledNavLink>
                    </Tooltip>
                    <ListItemLink name={"Games"} open={openDrawerGameMenu} onClick={handleToogleDrawerGameMenuClick} />
                    <Collapse component="li" in={openDrawerGameMenu} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            {
                                gameList.map((description: GameDescription) =>
                                    <StyledNavLink key={description.url} to={description.url}>
                                        <ListItem button onClick={handleDrawerClose}>
                                            <ListItemText sx={{paddingLeft: theme.spacing(4)}}
                                                          primary={description.name}/>
                                        </ListItem>
                                    </StyledNavLink>
                                )
                            }
                        </List>
                    </Collapse>
                    <Tooltip title={"About"}>
                        <StyledNavLink to={'/about'}>
                            <ListItem button onClick={handleDrawerClose}>
                                <ListItemIcon><Info/></ListItemIcon>
                                <ListItemText primary={"About"}/>
                            </ListItem>
                        </StyledNavLink>
                    </Tooltip>
                </List>
                <Divider />
                <List>
                    {
                        theme.palette.mode == "dark" ? (
                            <Tooltip title={"Light Mode"}>
                                <ListItem onClick={onToggleDarkModeEvent}>
                                    <ListItemIcon>
                                        <Brightness7Icon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Light Mode"}/>
                                </ListItem>
                            </Tooltip>) : (<Tooltip title={"Dark Mode"}>
                            <ListItem onClick={onToggleDarkModeEvent}>
                                <ListItemIcon>
                                    <Brightness4Icon/>
                                </ListItemIcon>
                                <ListItemText primary={"Dark Mode"}/>
                            </ListItem>
                        </Tooltip>)
                    }
                    {
                        document.fullscreenEnabled ?
                            !document.fullscreenElement ?  (
                                <Tooltip title={"Enter Fullscreen"}>
                                    <ListItem onClick={onToggleFullscreenEvent}>
                                        <ListItemIcon>
                                            <Fullscreen/>
                                        </ListItemIcon>
                                        <ListItemText primary={"Enter Fullscreen"}/>
                                    </ListItem>
                                </Tooltip>) : (<Tooltip title={"Exit Fullscreen"}>
                                <ListItem onClick={onToggleFullscreenEvent}>
                                    <ListItemIcon>
                                        <FullscreenExit/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Exit Fullscreen"}/>
                                </ListItem>
                            </Tooltip>) : null
                    }
                    {
                        serverConnected ?
                            (<Tooltip title={"Server connected"}>
                                <ListItem>
                                    <ListItemIcon>
                                        <WifiIcon style={{color: theme.palette.success.main}}/>
                                    </ListItemIcon>
                                    <ListItemText style={{color: theme.palette.success.main}}
                                                  primary={"Server connected"}/>
                                </ListItem>
                            </Tooltip>) : (
                                <Tooltip title={"Server not connected"}>
                                    <ListItem>
                                        <ListItemIcon>
                                            <WifiOffIcon style={{color: theme.palette.warning.main}}/>
                                        </ListItemIcon>
                                        <ListItemText style={{color: theme.palette.warning.main}}
                                                      primary={"Server not connected"}/>
                                    </ListItem>
                                </Tooltip>)
                    }
                    {
                        sensorsConnected ?
                            (<Tooltip title={"Sensors connected"}>
                                <ListItem>
                                    <ListItemIcon>
                                        <PowerIcon style={{color: theme.palette.success.main}}/>
                                    </ListItemIcon>
                                    <ListItemText style={{color: theme.palette.success.main}}
                                                  primary={"Sensors connected"}/>
                                </ListItem>
                            </Tooltip>) : (<Tooltip title={"Sensors not connected"}>
                                <ListItem>
                                    <ListItemIcon>
                                        <PowerOffIcon style={{color: theme.palette.warning.main}}/>
                                    </ListItemIcon>
                                    <ListItemText style={{color: theme.palette.warning.main}}
                                                  primary={"Sensors not connected"}/>
                                </ListItem>
                            </Tooltip>)
                    }
                    <Tooltip title={"Settings"}>
                        <StyledNavLink to={'/settings'}>
                            <ListItem button onClick={handleDrawerClose}>
                                <ListItemIcon><Settings/></ListItemIcon>
                                <ListItemText primary={"Settings"}/>
                            </ListItem>
                        </StyledNavLink>
                    </Tooltip>
                </List>
            </Drawer>
        </React.Fragment>);
    }

export default MobileDrawer;