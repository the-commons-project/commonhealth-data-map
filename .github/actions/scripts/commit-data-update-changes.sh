#!/bin/bash

set -e

if [[ -n "${CDM_DEBUG}" ]]; then
    set -x
fi

PUBLISHED_DATA_DIR=data/published
NOTEBOOK_LOGS_DIR=notebook-logs
TMP_SUFFIX="-AAA"

function usage() {

    echo -n \
        "Usage: $(basename "$0")
Push data update changes as part of the data update workflow.
"
}

if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    if [ "${1:-}" = "--help" ]; then
        usage
    else
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git fetch origin

        # Move the directories containing our changes out of
        # the way of the master checkout.
        mv ${PUBLISHED_DATA_DIR} ${PUBLISHED_DATA_DIR}${TMP_SUFFIX}
        mv ${NOTEBOOK_LOGS_DIR} ${NOTEBOOK_LOGS_DIR}${TMP_SUFFIX}
        git checkout master

        # Remove the target directories and move our changes back.
        rm -rf ${PUBLISHED_DATA_DIR}
        rm -rf ${NOTEBOOK_LOGS_DIR}
        mv ${PUBLISHED_DATA_DIR}${TMP_SUFFIX} ${PUBLISHED_DATA_DIR}
        mv ${NOTEBOOK_LOGS_DIR}${TMP_SUFFIX} ${NOTEBOOK_LOGS_DIR}

        # Only if there are diffs in the data update should we push.
        if ! git diff --quiet ${PUBLISHED_DATA_DIR} && git diff --staged --quiet ${PUBLISHED_DATA_DIR}; then
            echo "DATA UPDATES FOUND."

            # Show what files changed
            git status ${PUBLISHED_DATA_DIR}

            # Add our target changes and commit.
            git add ${PUBLISHED_DATA_DIR}
            git commit -m "Automatic data update for $(date -u +%Y-%m-%d)"

            echo "::set-output name=status::CHANGED"
        else
            echo "NO DATA UPDATES FOUND."

            echo "::set-output name=status::NO_CHANGES"
        fi
    fi
fi
