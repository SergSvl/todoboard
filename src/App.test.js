import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from '@/store';

test('Load main component App and find text: "Добавить группу"', () => {
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
  const linkElement = screen.getByText(/Добавить группу/i);
  expect(linkElement).toBeInTheDocument();
});
