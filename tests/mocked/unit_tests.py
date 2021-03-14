import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import APP, SOCKETIO

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class boardMove_test(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: {
                    'index': 7,
                    'move': 'x',
                    'moveCount': 1
                },
                KEY_EXPECTED: ["boardMove", 7, 'x', 1]
            },
            {
                KEY_INPUT: {
                    'index': 1,
                    'move': 'o',
                    'moveCount': 3
                },
                KEY_EXPECTED: ["boardMove", 1, 'o', 3]
            },
            {
                KEY_INPUT: {
                    'index': 8,
                    'move': 'o',
                    'moveCount': 2
                },
                KEY_EXPECTED: ["boardMove", 8, 'o', 2]
            },
        ]

    def test_boardMove(self):
        for test in self.success_test_params:
            client = SOCKETIO.test_client(APP)
            client2 = SOCKETIO.test_client(APP)
            client2.get_received()
            client.emit('boardMove', test[KEY_INPUT])
            received = client2.get_received()

            self.assertEqual(len(received), 1)
            self.assertEqual(len(received[0]['args']), 1)
            self.assertEqual(received[0]['name'], test[KEY_EXPECTED][0])
            self.assertEqual(received[0]['args'][0]['index'],
                             test[KEY_EXPECTED][1])
            self.assertEqual(received[0]['args'][0]['move'],
                             test[KEY_EXPECTED][2])
            self.assertEqual(received[0]['args'][0]['moveCount'],
                             test[KEY_EXPECTED][3])


class replay_test(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: {
                    'uName': 'tester'
                },
                KEY_EXPECTED: ['replay', {
                    'uName': 'tester'
                }]
            },
            {
                KEY_INPUT: {
                    'uName': 'tester123'
                },
                KEY_EXPECTED: ['replay', {
                    'uName': 'tester123'
                }]
            },
            {
                KEY_INPUT: {
                    'uName': 'testerguy'
                },
                KEY_EXPECTED: ['replay', {
                    'uName': 'testerguy'
                }]
            },
        ]

    def test_replay(self):
        for test in self.success_test_params:
            client = SOCKETIO.test_client(APP)
            client2 = SOCKETIO.test_client(APP)
            client2.get_received()
            client.emit('replay', test[KEY_INPUT])
            received = client2.get_received()

            self.assertEqual(len(received), 1)
            self.assertEqual(len(received[0]['args']), 1)
            self.assertEqual(received[0]['name'], test[KEY_EXPECTED][0])
            self.assertEqual(received[0]['args'][0], test[KEY_EXPECTED][1])


class reset_test(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: [None] * 9,
                KEY_EXPECTED: ['reset', [None] * 9]
            },
            {
                KEY_INPUT: [None] * 9,
                KEY_EXPECTED: ['reset', [None] * 9]
            },
            {
                KEY_INPUT: [None] * 9,
                KEY_EXPECTED: ['reset', [None] * 9]
            },
        ]

    def test_reset(self):
        for test in self.success_test_params:
            client = SOCKETIO.test_client(APP)
            client2 = SOCKETIO.test_client(APP)
            client2.get_received()
            client.emit('reset', test[KEY_INPUT])
            received = client2.get_received()

            self.assertEqual(len(received), 1)
            self.assertEqual(len(received[0]['args']), 1)
            self.assertEqual(received[0]['name'], test[KEY_EXPECTED][0])
            self.assertEqual(received[0]['args'][0], test[KEY_EXPECTED][1])


if __name__ == '__main__':
    unittest.main()
