#! /bin/bash

set -x

git clone https://github.com/tiann/KernelSU

GKI_ROOT=$(pwd)

echo "[+] GKI_ROOT: $GKI_ROOT"

if test -d "$GKI_ROOT/common/drivers"; then
     echo "[+] Copy kernel su driver to $GKI_ROOT/common/drivers"
     ln -sf $(pwd)/KernelSU/kernel $GKI_ROOT/common/drivers/kernelsu
     echo "[+] Add kernel su driver to Makefile"
     DRIVER_MAKEFILE=$GKI_ROOT/common/drivers/Makefile
     grep -q "kernelsu" $DRIVER_MAKEFILE || echo "obj-y += kernelsu/" >> $DRIVER_MAKEFILE
     echo "[+] Done."
elif test -d "$GKI_ROOT/drivers"; then
     echo "[+] Copy kernel su driver to $GKI_ROOT/drivers"
     ln -sf $(pwd)/KernelSU/kernel $GKI_ROOT/drivers/kernelsu
     echo "[+] Add kernel su driver to Makefile"
     DRIVER_MAKEFILE=$GKI_ROOT/drivers/Makefile
     grep -q "kernelsu" $DRIVER_MAKEFILE || echo "obj-y += kernelsu/" >> $DRIVER_MAKEFILE
     echo "[+] Done."
else
     echo "[ERROR] "drivers/" folder is not found."
fi
