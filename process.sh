rm -rf _output

mkdir _output

tippecanoe -f -pk -r1 --no-tile-compression -o _output/grid.mbtiles -b 0 -Z 8 -z 12 grid.geojson

mb-util --image_format=pbf _output/grid.mbtiles _output/tiles

cp -R _output/tiles public/tiles
