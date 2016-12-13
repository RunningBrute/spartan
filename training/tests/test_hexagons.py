import unittest
from django.test import TestCase

from training import hexagons

'''
 lat
  ^
  |
  |      __
  |   __/01\__
  |  /  \__/10\
  |  \__/00\__/
  |  /  \__/  \
  |  \__/  \__/
  |     \__/
  `----------------> lon

00's center is 0,0 in pixels

hexagons.point_to_hexagon((lon, lat))
'''

S = hexagons.HEXAGON_SIZE

H = hexagons.HEXAGON_HEIGHT
HALF_H = H / 2

W = hexagons.HEXAGON_WIDTH
HALF_W = W / 2


class HexagonsTestSuite(TestCase):
    def setUp(self):
        print("size: {}, width: {}, height: {}".format(S, W, H))

    def _expect_point_on_hex(self, h, p):
        self.assertEqual(h, hexagons.point_to_hexagon(p))

    def test_convert_from_pixel_00(self):
        self._expect_point_on_hex((0, 0), (0, 0))

        self._expect_point_on_hex((0, 0), (0, HALF_H - 1))
        self._expect_point_on_hex((0, 0), (HALF_W - 1, 0))

        self._expect_point_on_hex((0, 0), (0, -HALF_H + 1))
        self._expect_point_on_hex((0, 0), (-HALF_W + 1, 0))

    def test_convert_from_pixel_01(self):
        self._expect_point_on_hex((0, H), (0, HALF_H + 1))
        self._expect_point_on_hex((0, H), (0, H + HALF_H - 1))

    #@unittest.skip
    def test_monster(self):
        points = [(x, y) for x in range(1000) for y in range(1000)]
        hexagons.points_to_hexagon(points)
