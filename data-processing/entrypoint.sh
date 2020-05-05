#!/bin/bash

set -e

if [[ -n "${CDM_DEBUG}" ]]; then
    set -x
fi

DATA_PROC_DIR=$1

function usage() {
    echo -n \
        "Usage: $(basename "$0") DATA_PROC_DIR
Process data for dashboard and write to {DATA_PROC_DIR}/data/published.
"
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    mkdir -p ${DATA_PROC_DIR}/notebook-logs

    echo
    echo "==UPDATING JHU DATA=="
    echo

    papermill \
        ${DATA_PROC_DIR}/notebooks/jhu_data_processing.ipynb \
        -p data_dir ${DATA_PROC_DIR}/data \
        ${DATA_PROC_DIR}/notebook-logs/jhu_data_processing.ipynb

    echo
    echo "==UPDATING GOOGLE MOBILITY REPORT DATA=="
    echo

    papermill \
        ${DATA_PROC_DIR}/notebooks/mobility_data_processing.ipynb \
        -p data_dir ${DATA_PROC_DIR}/data \
        ${DATA_PROC_DIR}/notebook-logs/mobility_data_processing.ipynb

fi
