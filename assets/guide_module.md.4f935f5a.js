import{_ as e,o as s,c as n,a}from"./app.56e61cad.js";const y=JSON.parse('{"title":"Module guides","description":"","frontmatter":{},"headers":[{"level":2,"title":"Busybox","slug":"busybox","link":"#busybox","children":[]},{"level":2,"title":"KernelSU modules","slug":"kernelsu-modules","link":"#kernelsu-modules","children":[{"level":3,"title":"module.prop","slug":"module-prop","link":"#module-prop","children":[]},{"level":3,"title":"Shell scripts","slug":"shell-scripts","link":"#shell-scripts","children":[]},{"level":3,"title":"system directory","slug":"system-directory","link":"#system-directory","children":[]},{"level":3,"title":"system.prop","slug":"system-prop","link":"#system-prop","children":[]},{"level":3,"title":"sepolicy.rule","slug":"sepolicy-rule","link":"#sepolicy-rule","children":[]}]},{"level":2,"title":"Module installer","slug":"module-installer","link":"#module-installer","children":[{"level":3,"title":"Customization","slug":"customization","link":"#customization","children":[]}]},{"level":2,"title":"Boot scripts","slug":"boot-scripts","link":"#boot-scripts","children":[]}],"relativePath":"guide/module.md"}'),l={name:"guide/module.md"},o=a(`<h1 id="module-guides" tabindex="-1">Module guides <a class="header-anchor" href="#module-guides" aria-hidden="true">#</a></h1><p>KernelSU provides a module mechanism that achieves the effect of modifying the system directory while maintaining the integrity of the system partition. This mechanism is commonly known as &quot;systemless&quot;.</p><p>The module mechanism of KernelSU is almost the same as that of Magisk. If you are familiar with Magisk module development, developing KernelSU modules is very similar. You can skip the introduction of modules below and only need to read <a href="./difference-with-magisk.html">difference-with-magisk</a>.</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-hidden="true">#</a></h2><p>KernelSU ships with a feature complete BusyBox binary (including full SELinux support). The executable is located at <code>/data/adb/ksu/bin/busybox</code>. KernelSU&#39;s BusyBox supports runtime toggle-able &quot;ASH Standalone Shell Mode&quot;. What this standalone mode means is that when running in the <code>ash</code> shell of BusyBox, every single command will directly use the applet within BusyBox, regardless of what is set as <code>PATH</code>. For example, commands like <code>ls</code>, <code>rm</code>, <code>chmod</code> will <strong>NOT</strong> use what is in <code>PATH</code> (in the case of Android by default it will be <code>/system/bin/ls</code>, <code>/system/bin/rm</code>, and <code>/system/bin/chmod</code> respectively), but will instead directly call internal BusyBox applets. This makes sure that scripts always run in a predictable environment and always have the full suite of commands no matter which Android version it is running on. To force a command <em>not</em> to use BusyBox, you have to call the executable with full paths.</p><p>Every single shell script running in the context of KernelSU will be executed in BusyBox&#39;s <code>ash</code> shell with standalone mode enabled. For what is relevant to 3rd party developers, this includes all boot scripts and module installation scripts.</p><p>For those who want to use this &quot;Standalone Mode&quot; feature outside of KernelSU, there are 2 ways to enable it:</p><ol><li>Set environment variable <code>ASH_STANDALONE</code> to <code>1</code><br>Example: <code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>Toggle with command-line options:<br><code>/data/adb/ksu/bin/busybox sh -o standalone &lt;script&gt;</code></li></ol><p>To make sure all subsequent <code>sh</code> shell executed also runs in standalone mode, option 1 is the preferred method (and this is what KernelSU and the KernelSU manager internally use) as environment variables are inherited down to child processes.</p><div class="tip custom-block"><p class="custom-block-title">difference with Magisk</p><p>KernelSU&#39;s BusyBox is now using the binary file compiled directly from the Magisk project. <strong>Thanks to Magisk!</strong> Therefore, you don&#39;t have to worry about compatibility issues between BusyBox scripts in Magisk and KernelSU because they are exactly the same!</p></div><h2 id="kernelsu-modules" tabindex="-1">KernelSU modules <a class="header-anchor" href="#kernelsu-modules" aria-hidden="true">#</a></h2><p>A KernelSU module is a folder placed in <code>/data/adb/modules</code> with the structure below:</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">/data/adb/modules</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── $MODID                  &lt;--- The folder is named with the ID of the module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Module Identity ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── module.prop         &lt;--- This file stores the metadata of the module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Main Contents ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system              &lt;--- This folder will be mounted if skip_mount does not exist</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Status Flags ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── skip_mount          &lt;--- If exists, KernelSU will NOT mount your system folder</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── disable             &lt;--- If exists, the module will be disabled</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── remove              &lt;--- If exists, the module will be removed next reboot</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Optional Files ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── post-fs-data.sh     &lt;--- This script will be executed in post-fs-data</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── service.sh          &lt;--- This script will be executed in late_start service</span></span>
<span class="line"><span style="color:#A6ACCD;">|   ├── uninstall.sh        &lt;--- This script will be executed when KernelSU removes your module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system.prop         &lt;--- Properties in this file will be loaded as system properties by resetprop</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── sepolicy.rule       &lt;--- Additional custom sepolicy rules</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Auto Generated, DO NOT MANUALLY CREATE OR MODIFY ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── vendor              &lt;--- A symlink to $MODID/system/vendor</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── product             &lt;--- A symlink to $MODID/system/product</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system_ext          &lt;--- A symlink to $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Any additional files / folders are allowed ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── another_module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">difference with Magisk</p><p>KernelSU does not have built-in support for Zygisk, so there is no content related to Zygisk in the module. However, you can use <a href="https://github.com/Dr-TSNG/ZygiskOnKernelSU" target="_blank" rel="noreferrer">ZygiskOnKernelSU</a> to support Zygisk modules. In this case, the content of the Zygisk module is identical to that supported by Magisk.</p></div><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-hidden="true">#</a></h3><p>module.prop is a configuration file for a module. In KernelSU, if a module does not contain this file, it will not be recognized as a module. The format of this file is as follows:</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">description=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li><code>id</code> has to match this regular expression: <code>^[a-zA-Z][a-zA-Z0-9._-]+$</code><br> ex: ✓ <code>a_module</code>, ✓ <code>a.module</code>, ✓ <code>module-101</code>, ✗ <code>a module</code>, ✗ <code>1_module</code>, ✗ <code>-a-module</code><br> This is the <strong>unique identifier</strong> of your module. You should not change it once published.</li><li><code>versionCode</code> has to be an <strong>integer</strong>. This is used to compare versions</li><li>Others that weren&#39;t mentioned above can be any <strong>single line</strong> string.</li><li>Make sure to use the <code>UNIX (LF)</code> line break type and not the <code>Windows (CR+LF)</code> or <code>Macintosh (CR)</code>.</li></ul><h3 id="shell-scripts" tabindex="-1">Shell scripts <a class="header-anchor" href="#shell-scripts" aria-hidden="true">#</a></h3><p>Please read the <a href="#boot-scripts">Boot Scripts</a> section to understand the difference between <code>post-fs-data.sh</code> and <code>service.sh</code>. For most module developers, <code>service.sh</code> should be good enough if you just need to run a boot script.</p><p>In all scripts of your module, please use <code>MODDIR=\${0%/*}</code> to get your module&#39;s base directory path; do <strong>NOT</strong> hardcode your module path in scripts.</p><div class="tip custom-block"><p class="custom-block-title">difference with Magisk</p><p>You can use the environment variable KSU to determine if a script is running in KernelSU or Magisk. If running in KernelSU, this value will be set to true.</p></div><h3 id="system-directory" tabindex="-1"><code>system</code> directory <a class="header-anchor" href="#system-directory" aria-hidden="true">#</a></h3><p>The contents of this directory will be overlaid on top of the system&#39;s /system partition using overlayfs after the system is booted. This means that:</p><ol><li>Files with the same name as those in the corresponding directory in the system will be overwritten by the files in this directory.</li><li>Folders with the same name as those in the corresponding directory in the system will be merged with the folders in this directory.</li></ol><p>If you want to delete a file or folder in the original system directory, you need to create a file with the same name as the file/folder in the module directory using <code>mknod filename c 0 0</code>. This way, the overlayfs system will automatically &quot;whiteout&quot; this file as if it has been deleted (the /system partition is not actually changed).</p><p>You can also declare a variable named <code>REMOVE</code> containing a list of directories in <code>customize.sh</code> to execute removal operations, and KernelSU will automatically execute <code>mknod &lt;TARGET&gt; c 0 0</code> in the corresponding directories of the module. For example:</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">REMOVE</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><p>The above list will execute <code>mknod $MODPATH/system/app/YouTuBe c 0 0</code> and <code>mknod $MODPATH/system/app/Bloatware c 0 0</code>; and <code>/system/app/YouTube</code> and <code>/system/app/Bloatware</code> will be removed after the module takes effect.</p><p>If you want to replace a directory in the system, you need to create a directory with the same path in your module directory, and then set the attribute <code>setfattr -n trusted.overlay.opaque -v y &lt;TARGET&gt;</code> for this directory. This way, the overlayfs system will automatically replace the corresponding directory in the system (without changing the /system partition).</p><p>You can declare a variable named <code>REPLACE</code> in your <code>customize.sh</code> file, which includes a list of directories to be replaced, and KernelSU will automatically perform the corresponding operations in your module directory. For example:</p><p>REPLACE=&quot; /system/app/YouTube /system/app/Bloatware &quot;</p><p>This list will automatically create the directories <code>$MODPATH/system/app/YouTube</code> and <code>$MODPATH/system/app/Bloatware</code>, and then execute <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/YouTube</code> and <code>setfattr -n trusted.overlay.opaque -v y $MODPATH/system/app/Bloatware</code>. After the module takes effect, <code>/system/app/YouTube</code> and <code>/system/app/Bloatware</code> will be replaced with empty directories.</p><div class="tip custom-block"><p class="custom-block-title">difference with Magisk</p><p>KernelSU&#39;s systemless mechanism is implemented through the kernel&#39;s overlayfs, while Magisk currently uses magic mount (bind mount). The two implementation methods have significant differences, but the ultimate goal is the same: to modify /system files without physically modifying the /system partition.</p></div><p>If you are interested in overlayfs, it is recommended to read the Linux Kernel&#39;s <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">documentation on overlayfs</a>.</p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-hidden="true">#</a></h3><p>This file follows the same format as <code>build.prop</code>. Each line comprises of <code>[key]=[value]</code>.</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-hidden="true">#</a></h3><p>If your module requires some additional sepolicy patches, please add those rules into this file. Each line in this file will be treated as a policy statement.</p><h2 id="module-installer" tabindex="-1">Module installer <a class="header-anchor" href="#module-installer" aria-hidden="true">#</a></h2><p>A KernelSU module installer is a KernelSU module packaged in a zip file that can be flashed in the KernelSU manager APP. The simplest KernelSU module installer is just a KernelSU module packed as a zip file.</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">module.zip</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span>
<span class="line"><span style="color:#A6ACCD;">├── customize.sh                       &lt;--- (Optional, more details later)</span></span>
<span class="line"><span style="color:#A6ACCD;">│                                           This script will be sourced by update-binary</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...  /* The rest of module&#39;s files */</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>KernelSU module is NOT supported to be installed in custom recovery!!</p></div><h3 id="customization" tabindex="-1">Customization <a class="header-anchor" href="#customization" aria-hidden="true">#</a></h3><p>If you need to customize the module installation process, optionally you can create a script in the installer named <code>customize.sh</code>. This script will be <em>sourced</em> (not executed!) by the module installer script after all files are extracted and default permissions and secontext are applied. This is very useful if your module require additional setup based on the device ABI, or you need to set special permissions/secontext for some of your module files.</p><p>If you would like to fully control and customize the installation process, declare <code>SKIPUNZIP=1</code> in <code>customize.sh</code> to skip all default installation steps. By doing so, your <code>customize.sh</code> will be responsible to install everything by itself.</p><p>The <code>customize.sh</code> script runs in KernelSU&#39;s BusyBox <code>ash</code> shell with &quot;Standalone Mode&quot; enabled. The following variables and functions are available:</p><h4 id="variables" tabindex="-1">Variables <a class="header-anchor" href="#variables" aria-hidden="true">#</a></h4><ul><li><code>KSU</code> (bool): a variable to mark that the script is running in the KernelSU environment, and the value of this variable will always be true. You can use it to distinguish between KernelSU and Magisk.</li><li><code>KSU_VER</code> (string): the version string of current installed KernelSU (e.g. <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): the version code of current installed KernelSU in userspace (e.g. <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): the version code of current installed KernelSU in kernel space (e.g. <code>10672</code>)</li><li><code>BOOTMODE</code> (bool): always be <code>true</code> in KernelSU</li><li><code>MODPATH</code> (path): the path where your module files should be installed</li><li><code>TMPDIR</code> (path): a place where you can temporarily store files</li><li><code>ZIPFILE</code> (path): your module&#39;s installation zip</li><li><code>ARCH</code> (string): the CPU architecture of the device. Value is either <code>arm</code>, <code>arm64</code>, <code>x86</code>, or <code>x64</code></li><li><code>IS64BIT</code> (bool): <code>true</code> if <code>$ARCH</code> is either <code>arm64</code> or <code>x64</code></li><li><code>API</code> (int): the API level (Android version) of the device (e.g. <code>23</code> for Android 6.0)</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>In KernelSU, MAGISK_VER_CODE is always 25200 and MAGISK_VER is always v25.2. Please do not use these two variables to determine whether it is running on KernelSU or not.</p></div><h4 id="functions" tabindex="-1">Functions <a class="header-anchor" href="#functions" aria-hidden="true">#</a></h4><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print &lt;msg&gt; to console</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;echo&#39; as it will not display in custom recovery&#39;s console</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print error message &lt;msg&gt; to console and terminate the installation</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;exit&#39; as it will skip the termination cleanup steps</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    this function is a shorthand for the following commands:</span></span>
<span class="line"><span style="color:#A6ACCD;">       chown owner.group target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chmod permission target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chcon context target</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all files in &lt;directory&gt;, it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all directories in &lt;directory&gt; (including itself), it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm dir owner group dirpermission context</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="boot-scripts" tabindex="-1">Boot scripts <a class="header-anchor" href="#boot-scripts" aria-hidden="true">#</a></h2><p>In KernelSU, scripts are divided into two types based on their running mode: post-fs-data mode and late_start service mode:</p><ul><li>post-fs-data mode <ul><li>This stage is BLOCKING. The boot process is paused before execution is done, or 10 seconds have passed.</li><li>Scripts run before any modules are mounted. This allows a module developer to dynamically adjust their modules before it gets mounted.</li><li>This stage happens before Zygote is started, which pretty much means everything in Android</li><li><strong>WARNING:</strong> using <code>setprop</code> will deadlock the boot process! Please use <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code> instead.</li><li><strong>Only run scripts in this mode if necessary.</strong></li></ul></li><li>late_start service mode <ul><li>This stage is NON-BLOCKING. Your script runs in parallel with the rest of the booting process.</li><li><strong>This is the recommended stage to run most scripts.</strong></li></ul></li></ul><p>In KernelSU, startup scripts are divided into two types based on their storage location: general scripts and module scripts:</p><ul><li>General Scripts <ul><li>Placed in <code>/data/adb/post-fs-data.d</code> or <code>/data/adb/service.d</code></li><li>Only executed if the script is set as executable (<code>chmod +x script.sh</code>)</li><li>Scripts in <code>post-fs-data.d</code> runs in post-fs-data mode, and scripts in <code>service.d</code> runs in late_start service mode.</li><li>Modules should <strong>NOT</strong> add general scripts during installation</li></ul></li><li>Module Scripts <ul><li>Placed in the module&#39;s own folder</li><li>Only executed if the module is enabled</li><li><code>post-fs-data.sh</code> runs in post-fs-data mode, and <code>service.sh</code> runs in late_start service mode.</li></ul></li></ul><p>All boot scripts will run in KernelSU&#39;s BusyBox <code>ash</code> shell with &quot;Standalone Mode&quot; enabled.</p>`,58),t=[o];function i(r,c,p,d,u,h){return s(),n("div",null,t)}const A=e(l,[["render",i]]);export{y as __pageData,A as default};
