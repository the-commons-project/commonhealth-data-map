# commonhealth-data-map

![Dashboard Data Update](https://github.com/azavea/commonhealth-data-map/workflows/Dashboard%20Data%20Update/badge.svg)

A CommonHealth data map.

## Setup

Run `./scripts/setup` and then `./scripts/server`.

## Processing data

There are two steps to processing data for the dashboard.

- Publishing processed data: Generates processed data that is committed to the repository.
- Publishing visualization data: Generates data for visualization, including vector tiles.
This data is not committed to the repository.

### Setup

All commands below should be run in the `data-processing` directory.

#### Build the container

```
data-processing> ./scripts/build
```

#### Run Jupyter Notebooks

To run jupyter notebooks, use

```
data-processing> ./scripts/notebook
```

and browse to the URL output last in the console. Notebooks are stored in `notebooks`.
Output data should be placed in `data/output` folder if it's not to be published to the site
(otherwise use data/published). External data that is committed to
the repository should go in `data`. You can use `data/cache` as a download cache.
`data/output` and `data/cache` are ignored folders.


### Publishing processed data

This process takes any source data pulled in via specific notebooks in
`data-processing/notebooks` and generates data that is committed to the repository in
`data-processing/data/published`. Published data that needs to be refreshed continually
will do so through a GitHub action.

Running papermill will also produce notebooks that have their output cells showing the results
of the notebook run; these are placed in the `notebook-logs` folder for inspection of the latest
data processing runs and committed to the repository.

#### Running locally

In the `data-processing` directory, use:

```
data-processing> scripts/update-data
```

to run the containerized workflow for updating the data. This utilizes the same process
as the GitHub action, the difference being the filesystem mounted into the containers.

### Publishing visualization data

This process will gather files from `data-processing/data/published`
and place it into the site's `build` folder for visualization through the front-end. This step
includes visualization-specific data processing steps, such as building vector tiles. Data generated
through this process will not be committed to the repository, but will be built by Netlify on deploy.

#### Running locally

Use `scripts/build-website` to generate the visualization data locally. _Note!_ All changes need to be committed for this command to work.

You can then copy `build/data` into `public/data` for usage with the dev server. Also if you make changes to GeoJSON that is directly used in the website, you can copy the data from `data-processing/data/published` into `public/data`.

The `package.json` contains a mechanism that will proxy requests to the staging server, so if you do not generate your own visualization data locally the requests will pull from staging data. Note that this will cause
missing data files to be read as HTML responses, so you may see JSON parse errors if the data file you
are trying to read in doesn't actually exist yet.

### Adding new data for visualization.

If you create data for publishing to the site, create it in the `data/published` directory
and modify the `cibuild` script to include moving it to the
correct location or performing any secondary processing like vector tile generation.

## Scripts

| Name            | Description                                               |
| --------------  | --------------------------------------------------------- |
| `build-website` | Build the application and visualization data locally.     |
| `cibuild`       | Build application for staging or a release.               |
| `server`        | Start application.                                        |
| `setup`         | Attempts to setup the project's development environment.  |
| `test`          | Run linters and tests.                                    |
| `update`        | Install project runtime dependencies.                     |
