# Preflight — Design direction

## Product surface

Preflight is a route book of checklists. It gives the visitor a procedure index, a detail route, and a local run state for checking each item.

## Visual world

An aviation preflight desk: high-visibility yellow, dark instrument ink, route-book numbering, phase headers, and a progress strip that makes the next action concrete.

## Direction seed

Impeccable operate direction seed was resolved for the checklist product. The grounded interpretation is a preflight route book with a live run sheet.

## System

- Palette: paper `#f2eee3`, instrument black `#17201f`, safety yellow `#e4ba3e`, route blue `#397c7b`, alert red `#b54738`.
- Typography: Oswald gives the procedure hierarchy; Fira Code carries phase labels and operational metadata.
- Composition: dispatch hero, procedure shelf, and detail run sheet; priority is a stamped operational signal.
- Interaction: open a checklist, check items, reset a run, and persist progress by slug in local storage.
- Responsive: the shelf becomes one route per row and the detail facts/checklist remain readable on a narrow device.

## Honesty constraints

This is a personal operating aid. Completing a local checklist must not imply safety certification, deployment readiness, or external sign-off.
