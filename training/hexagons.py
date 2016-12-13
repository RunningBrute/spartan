from math import sqrt, floor


SQRT_3 = 1.7320508075688772

HEXAGON_SIZE = 100
HEXAGON_WIDTH = HEXAGON_SIZE * 2
HEXAGON_HEIGHT = SQRT_3 / 2 * HEXAGON_WIDTH

S = HEXAGON_SIZE


def point_to_hexagon(point):
    x, y = point

    x = x / 3
    z = (-x + SQRT_3 / 3 * y) / S
    x = x * 2 / S
    y = -x-z

    rx = round(x)
    ry = round(y)
    rz = round(z)

    xd = abs(rx - x)
    yd = abs(ry - y)
    zd = abs(rz - z)

    if xd > yd and xd > zd:
        rx = -ry-rz
    elif yd > zd:
        pass
    else:
        rz = -rx-ry

    rx = rx / 2
    y = S * SQRT_3 * (rz + rx)
    x = S * 3 * rx

    return x, y


def points_to_hexagon(points):
    return [point_to_hexagon(p) for p in points]
