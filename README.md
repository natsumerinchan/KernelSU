# KernelSU for Old kernel 

Make old devices can use KernelSU.

If it doesn't work or reports errors, you should troubleshoot problems by yourselve from scratch.

## Build

### Build for old Kernel

1. Download the kernel source for your device first.
2. cd `<kernel source dir>`
3. `curl -LSs "https://raw.githubusercontent.com/natsumerinchan/KernelSU/Old_Kernel/kernel/setup.sh" | bash -`
4. Cherry-pick this [commit](https://github.com/natsumerinchan/KernelSU/commit/25fb881bb855de4e170ea17e9a147fa29d85c40f) ,it is based on this [video](https://www.bilibili.com/video/BV1ge4y1G7Dy)
5. Build the kernel.

### Build the Manager App

Android Studio / Gradle

### Discussion

[@KernelSU](https://t.me/KernelSU)

## License

[GPL-3](http://www.gnu.org/copyleft/gpl.html)

## Credits

- [kernel-assisted-superuser](https://git.zx2c4.com/kernel-assisted-superuser/about/): the KernelSU idea.
- [genuine](https://github.com/brevent/genuine/): apk v2 signature validation.
- [Diamorphine](https://github.com/m0nad/Diamorphine): some rootkit skills.
- [Magisk](https://github.com/topjohnwu/Magisk): the sepolicy implementation.
