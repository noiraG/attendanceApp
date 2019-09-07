import React from "react";
import NavigationBar from "./Component/navigationbar/navigateBar";
import "./App.css";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <div className="App">
      <Grid direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item>
          <NavigationBar></NavigationBar>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
