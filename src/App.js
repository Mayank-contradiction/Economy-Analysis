import Main from './components/Main';
import {BrowserRouter, Route} from 'react-router-dom';
import GraphViewPage from './components/GraphViewPage';

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Main} />
      <Route exact path="/graph-representation" component={GraphViewPage} />
    </BrowserRouter>
  );
}

export default App;