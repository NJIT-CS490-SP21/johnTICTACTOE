import unittest
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import update_user_list, winner_and_loser

KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class test_winner_and_loser(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: {
                'winner': 'john',
                'loser': 'mike'
            },
            KEY_EXPECTED: ['john', 'mike']
        }, {
            KEY_INPUT: {
                'loser': 'woooa',
                'winner': 'ppppp'
            },
            KEY_EXPECTED: ['ppppp', 'woooa']
        }, {
            KEY_INPUT: {
                'winner': 'yyuu',
                'loser': 'eee'
            },
            KEY_EXPECTED: ['yyuu', 'eee']
        }]

    def test_win_lose(self):
        for test in self.success_test_params:
            actual_result = winner_and_loser(test[KEY_INPUT])

            expected_result = test[KEY_EXPECTED]

            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)


class test_update_user_list(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: ["john", "add"],
            KEY_EXPECTED: ["john"]
        }, {
            KEY_INPUT: ["mike", "add"],
            KEY_EXPECTED: ["john", "mike"]
        }, {
            KEY_INPUT: ["mike", "remove"],
            KEY_EXPECTED: ["john"]
        }]

    def test_update(self):
        for test in self.success_test_params:
            actual_result = update_user_list(test[KEY_INPUT][0],
                                             test[KEY_INPUT][1])

            expected_result = test[KEY_EXPECTED]

            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
