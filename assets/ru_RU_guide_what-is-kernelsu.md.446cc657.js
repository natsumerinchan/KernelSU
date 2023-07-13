import{_ as e,o as a,c as r,O as t}from"./chunks/framework.43781440.js";const m=JSON.parse('{"title":"Что такое KernelSU?","description":"","frontmatter":{},"headers":[],"relativePath":"ru_RU/guide/what-is-kernelsu.md","filePath":"ru_RU/guide/what-is-kernelsu.md"}'),l={name:"ru_RU/guide/what-is-kernelsu.md"},o=t('<h1 id="что-такое-kernelsu" tabindex="-1">Что такое KernelSU? <a class="header-anchor" href="#что-такое-kernelsu" aria-label="Permalink to &quot;Что такое KernelSU?&quot;">​</a></h1><p>KernelSU - это root-решение для устройств Android GKI, работающее в режиме ядра и предоставляющее root-права пользовательским приложениям непосредственно в пространстве ядра.</p><h2 id="особенности" tabindex="-1">Особенности <a class="header-anchor" href="#особенности" aria-label="Permalink to &quot;Особенности&quot;">​</a></h2><p>Основной особенностью KernelSU является то, что он <strong>основан на ядре</strong>. KernelSU работает в режиме ядра, поэтому он может предоставить интерфейс ядра, которого раньше не было. Например, мы можем добавить аппаратную точку останова любому процессу в режиме ядра; мы можем получить доступ к физической памяти любого процесса без чьего-либо ведома; мы можем перехватить любой syscall в пространстве ядра; и т.д.</p><p>Кроме того, KernelSU предоставляет систему модулей через overlayfs, что позволяет загружать в систему пользовательские плагины. Также предусмотрен механизм модификации файлов в разделе <code>/system</code>.</p><h2 id="как-использовать" tabindex="-1">Как использовать <a class="header-anchor" href="#как-использовать" aria-label="Permalink to &quot;Как использовать&quot;">​</a></h2><p>Пожалуйста, обратитесь к: <a href="./installation.html">Установка</a></p><h2 id="как-собрать" tabindex="-1">Как собрать <a class="header-anchor" href="#как-собрать" aria-label="Permalink to &quot;Как собрать&quot;">​</a></h2><p><a href="./how-to-build.html">Как собрать</a></p><h2 id="обсуждение" tabindex="-1">Обсуждение <a class="header-anchor" href="#обсуждение" aria-label="Permalink to &quot;Обсуждение&quot;">​</a></h2><ul><li>Telegram: <a href="https://t.me/KernelSU" target="_blank" rel="noreferrer">@KernelSU</a></li></ul>',11),n=[o];function s(i,h,d,c,_,u){return a(),r("div",null,n)}const f=e(l,[["render",s]]);export{m as __pageData,f as default};
