#! /bin/bash

set -x

rm -rf ./KernelSU
git clone https://github.com/tiann/KernelSU

GKI_ROOT=$(pwd)

echo "[+] GKI_ROOT: $GKI_ROOT"
echo "[+] Copy kernel su driver to $GKI_ROOT/drivers"

ln -sf $(pwd)/KernelSU/kernel $GKI_ROOT/drivers/kernelsu

echo "[+] Add kernel su driver to Makefile"

DRIVER_MAKEFILE=$GKI_ROOT/drivers/Makefile
grep -q "kernelsu" $DRIVER_MAKEFILE || echo "obj-y += kernelsu/" >> $DRIVER_MAKEFILE

echo "[+] Done."
