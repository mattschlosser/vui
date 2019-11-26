from shutil import copyfile
for filename in ["vui.umd.min.js","vui.umd.min.js.map"]:
    copyfile("./dist/" + filename,"Z:/assets/vue/js/" + filename)
print("Files transfered to centos")