#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/uaccess.h>
#include <linux/string.h>
#include <linux/kernel.h>
#include <linux/errno.h>
#include <linux/mm.h>
#include <linux/gfp.h>
#include <linux/proc_fs.h>
#include <linux/seq_file.h>

static char* find_llvm_funcname(const char* orig_name) {
    struct file *file;
    char *buf;
    mm_segment_t old_fs;
    old_fs = get_fs();
    set_fs(KERNEL_DS);
    file = filp_open("/proc/kallsyms", O_RDONLY, 0);
    set_fs(old_fs);
    if (IS_ERR(file)) {
        pr_err("Cannot open /proc/kallsyms\n");
        return orig_name;
    }

    buf = kzalloc(PAGE_SIZE, GFP_KERNEL);
    if (!buf) {
        pr_err("Cannot allocate buffer\n");
        filp_close(file, 0);
        return orig_name;
    }

    old_fs = get_fs();
    set_fs(KERNEL_DS);
    file->f_op->read(file, buf, PAGE_SIZE, &file->f_pos);
    set_fs(old_fs);

    char *found = strnstr(buf, orig_name, PAGE_SIZE);
    if (found) {
        char* suffix = ".llvm.";
        char *llvm_name = strnstr(found, suffix, PAGE_SIZE);
        if (llvm_name) {
            size_t llvm_name_len = strcspn(llvm_name, " \t\n");
            char* new_name = kzalloc(llvm_name_len + 1, GFP_KERNEL);
            strncpy(new_name, llvm_name, llvm_name_len);
            kfree(buf);
            filp_close(file, 0);
            return new_name;
        }
    }

    kfree(buf);
    filp_close(file, 0);
    return orig_name;
}