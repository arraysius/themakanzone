import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Info from '@material-ui/icons/Info';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  flex: {
    flex: '1 1 auto'
  }
});

class TileSelect extends Component {
  render() {
    return (
      <form noValidate autoComplete="off">
        <FormControl>
          <InputLabel>
            Tile
        </InputLabel>
          <Select
            value={this.props.selectedTile}
            onChange={event => this.props.onTileChange(event)}
          >
            <MenuItem value="">
              <em>Select Tile</em>
            </MenuItem>
            <MenuItem value={'Default'}>Default</MenuItem>
            <MenuItem value={'Night'}>Night</MenuItem>
            <MenuItem value={'Grey'}>Grey</MenuItem>
            <MenuItem value={'Original'}>Original</MenuItem>
          </Select>
        </FormControl>
      </form>
    );
  }
}

class InfoDialog extends Component {
  render() {
    return (
      <Dialog open={this.props.isOpen} aria-labelledby="info-dialog">
        <DialogTitle id="info-dialog">
          About The Makan Zone <span role="img" aria-label="emoji">🍽️🗺️</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            A collection of interesting and delicious food places ranging from 
            hawker centers to cafés and restaurants in Singapore, all displayed 
            on a map.
            <br />
            <br />
            Built with React, Material-UI, Leaflet, OneMap
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <a
            style={{ textDecoration: 'none' }}
            href="https://www.github.com/arraysius/themakanzone"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button color="primary">
              GitHub
            </Button>
          </a>
          <Button onClick={() => this.props.closeDialog()} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class MyAppBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      infoDialogOpen: false
    }
  }

  openInfoDialog = () => {
    this.setState({
      infoDialogOpen: true
    });
  }

  closeInfoDialog = () => {
    this.setState({
      infoDialogOpen: false
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar
        className={classes.appBar}
        position="fixed"
        color="default">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={() => this.props.toggleFoodDrawer()}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            The Makan Zone
            {/* <span role="img" aria-label="emoji">🍽️🗺️</span> */}
          </Typography>

          <div className={classes.flex} />

          <TileSelect
            selectedTile={this.props.selectedTile}
            onTileChange={this.props.onTileChange}
          />

          {/* Info button */}
          <IconButton
            aria-haspopup="true"
            onClick={() => this.openInfoDialog()}
            color="inherit"
          >
            <Info />
          </IconButton>
        </Toolbar>

        <InfoDialog
          isOpen={this.state.infoDialogOpen}
          closeDialog={this.closeInfoDialog}
        />
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MyAppBar);
