import React, { useState, useCallback } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ListIcon from "@mui/icons-material/List";
import { useLocation, useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import { debounce } from "lodash";

const routes = [
  { path: "/v1/bulklisting", name: "Bulk Listing", icon: <ListIcon /> },
  { path: "/v1/bulkupload", name: "Bulk Upload", icon: <UploadFileIcon /> },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

export const Layout = ({ onSearch }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text) => {
      onSearch(text);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ marginBottom: 4 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            onClick={() => navigate("/v1/customerlogs")}
          >
            Customer logs
          </Typography>
          {location.pathname === "/v1/customerlogs" && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchText}
                onChange={handleSearchChange}
              />
            </Search>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <List>
          {routes.map((route, index) => (
            <ListItem key={index} onClick={() => navigate(route.path)}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
          ))}
          <Divider />
          <ListItem onClick={() => navigate("/v1/customerlogs")}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Logs" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};
