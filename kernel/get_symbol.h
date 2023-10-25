#include <linux/kernel.h>
#include <linux/kallsyms.h>
#include <linux/slab.h>
#include <linux/string.h>

struct find_llvm_context {
    char *orig_name;
    char *llvm_name;
};

static int find_llvm_callback(void *data, const char *name, struct module *mod, unsigned long addr) {
    struct find_llvm_context *ctx = (struct find_llvm_context *)data;
    if (strstr(name, ctx->orig_name) && strstr(name, ".llvm")) {
        ctx->llvm_name = kstrdup(name, GFP_KERNEL);
        return 1; // Non-zero return value stops the iteration
    }
    return 0;
}

static char *find_llvm_funcname(char *orig_name) {
    struct find_llvm_context ctx;
    ctx.orig_name = orig_name;
    ctx.llvm_name = NULL;

    kallsyms_on_each_symbol(find_llvm_callback, &ctx);

    if (ctx.llvm_name) {
        return ctx.llvm_name;
    } else {
        return orig_name;
    }
}