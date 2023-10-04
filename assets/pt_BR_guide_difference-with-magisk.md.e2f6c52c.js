import{_ as e,o,c as a,O as s}from"./chunks/framework.43781440.js";const h=JSON.parse('{"title":"Diferença com Magisk","description":"","frontmatter":{},"headers":[],"relativePath":"pt_BR/guide/difference-with-magisk.md","filePath":"pt_BR/guide/difference-with-magisk.md"}'),i={name:"pt_BR/guide/difference-with-magisk.md"},r=s('<h1 id="diferenca-com-magisk" tabindex="-1">Diferença com Magisk <a class="header-anchor" href="#diferenca-com-magisk" aria-label="Permalink to &quot;Diferença com Magisk&quot;">​</a></h1><p>Embora existam muitas semelhanças entre os módulos KernelSU e os módulos Magisk, existem inevitavelmente algumas diferenças devido aos seus mecanismos de implementação completamente diferentes. Se você deseja que seu módulo seja executado no Magisk e no KernelSU, você deve entender essas diferenças.</p><h2 id="semelhancas" tabindex="-1">Semelhanças <a class="header-anchor" href="#semelhancas" aria-label="Permalink to &quot;Semelhanças&quot;">​</a></h2><ul><li>Formato de arquivo do módulo: ambos usam o formato zip para organizar os módulos, e o formato dos módulos é quase o mesmo</li><li>Diretório de instalação do módulo: ambos localizados em <code>/data/adb/modules</code></li><li>Sem sistema: ambos suportam a modificação de /system de maneira sem sistema por meio de módulos</li><li>post-fs-data.sh: o tempo de execução e a semântica são exatamente os mesmos</li><li>service.sh: o tempo de execução e a semântica são exatamente os mesmos</li><li>system.prop: completamente o mesmo</li><li>sepolicy.rule: completamente o mesmo</li><li>BusyBox: os scripts são executados no BusyBox com o &quot;Modo Autônomo&quot; ativado em ambos os casos</li></ul><h2 id="diferencas" tabindex="-1">Diferenças <a class="header-anchor" href="#diferencas" aria-label="Permalink to &quot;Diferenças&quot;">​</a></h2><p>Antes de entender as diferenças, você precisa saber diferenciar se o seu módulo está rodando no KernelSU ou Magisk. Você pode usar a variável de ambiente <code>KSU</code> para diferenciá-la em todos os locais onde você pode executar os scripts do módulo (<code>customize.sh</code>, <code>post-fs-data.sh</code>, <code>service.sh</code>). No KernelSU, esta variável de ambiente será definida como <code>true</code>.</p><p>Aqui estão algumas diferenças:</p><ul><li>Os módulos KernelSU não podem ser instalados no modo Recovery.</li><li>Os módulos KernelSU não têm suporte integrado para Zygisk (mas você pode usar módulos Zygisk através do <a href="https://github.com/Dr-TSNG/ZygiskOnKernelSU" target="_blank" rel="noreferrer">ZygiskOnKernelSU</a>.</li><li>O método para substituir ou excluir arquivos nos módulos KernelSU é completamente diferente do Magisk. O KernelSU não suporta o método <code>.replace</code>. Em vez disso, você precisa criar um arquivo com o mesmo nome <code>mknod filename c 0 0</code> para excluir o arquivo correspondente.</li><li>Os diretórios do BusyBox são diferentes. O BusyBox integrado no KernelSU está localizado em <code>/data/adb/ksu/bin/busybox</code>, enquanto no Magisk está em <code>/data/adb/magisk/busybox</code>. <strong>Observe que este é um comportamento interno do KernelSU e pode mudar no futuro!</strong></li><li>KernelSU não suporta arquivos <code>.replace</code>; entretanto, KernelSU suporta as variáveis ​​<code>REMOVE</code> e <code>REPLACE</code> para remover ou substituir arquivos e pastas.</li><li>KernelSU adiciona o estágio <code>boot-completed</code> para executar alguns scripts na inicialização concluída.</li><li>KernelSU adiciona o estágio <code>post-mount</code> para executar alguns scripts após montar overlayfs.</li></ul>',8),t=[r];function d(n,m,c,l,u,p){return o(),a("div",null,t)}const g=e(i,[["render",d]]);export{h as __pageData,g as default};
