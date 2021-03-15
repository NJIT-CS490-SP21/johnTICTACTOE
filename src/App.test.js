import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('username is entered and screen changes to show board', () => {
  render(<App />);

  //check for login button
  const enterUsernameButton = screen.getByRole('button', { name: /enter username/i });
  expect(enterUsernameButton).toBeInTheDocument();

  //click it
  fireEvent.click(enterUsernameButton);
  expect(enterUsernameButton).not.toBeInTheDocument();

  //only shows up if we are on the board screen
  const activePlayerText = screen.getByText('Active players:');
  expect(activePlayerText).toBeInTheDocument();
});

test('show leaderboard is clicked after logging in, and it does show the leaderboard', () => {
  render(<App />);

  //loggin in
  const enterUsernameButton = screen.getByRole('button', { name: /enter username/i });
  expect(enterUsernameButton).toBeInTheDocument();
  fireEvent.click(enterUsernameButton);
  expect(enterUsernameButton).not.toBeInTheDocument();

  //check to makesure leaderboard isnt there, then check for show leadeboard button, click the button and check for leaderboard to be there
  expect(screen.queryByText('Leaderboard')).not.toBeInTheDocument();
  const showLeaderboardButton = screen.getByText('Show Leaderboard');
  expect(showLeaderboardButton).toBeInTheDocument();
  fireEvent.click(showLeaderboardButton);
  expect(screen.getByText('Leaderboard')).toBeInTheDocument();
});

test('show leaderboard hidden on hide leaderboard click', () => {
  render(<App />);

  //loggin in
  const enterUsernameButton = screen.getByRole('button', { name: /enter username/i });
  expect(enterUsernameButton).toBeInTheDocument();
  fireEvent.click(enterUsernameButton);
  expect(enterUsernameButton).not.toBeInTheDocument();

  //opening leaderboard and doing checks
  expect(screen.queryByText('Leaderboard')).not.toBeInTheDocument();
  const showLeaderboardButton = screen.getByText('Show Leaderboard');
  expect(showLeaderboardButton).toBeInTheDocument();
  fireEvent.click(showLeaderboardButton);
  expect(screen.getByText('Leaderboard')).toBeInTheDocument();

  //click hide leaderboard to hide it
  const hideLeaderboardButton = screen.getByText('Hide Leaderboard');
  expect(hideLeaderboardButton).toBeInTheDocument();
  fireEvent.click(hideLeaderboardButton);
  expect(screen.queryByText('Leaderboard')).not.toBeInTheDocument();
});
