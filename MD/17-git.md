# GitHub 使用

## Git 的基础配置

### 1. `user.name` && `user.email` 配置

配置使用 Git 仓库的用户 name 和 email，可设置全局的 `user.name` 和 `user.email`，在命令行输入：

```shell
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```

注意 `git config` 命令的 `--global` 参数，表示这台机器上所有的 Git 仓库都会使用这个配置，如果不想使用全局的信息，想对某个仓库指定不同的用户名和 Email 地址，可在当前项目下设置:

```shell
$ git config user.name "Your Name"
$ git config user.email "email@example.com"
```

### 2. 配置别名

```shell
$ git config --global alias.st status   # 用 st 代替 status
$ git config --global alias.cm commit   # 用 cm 代替 commit
```

### 3. 查看配置

可通过以下命令查看当前项目的用户名和邮箱。

```shell
$ git config user.name
$ git config user.email
```

通过以下命令查看配置列表：

```shell
$ git config --list           # 默认全局配置列表
$ git config --local --list   # 当前文件的配置列表
```

### 4. [`.gitignore` 文件](https://github.com/github/gitignore)

在 `.gitignore` 中列出来的文件或文件目录，在提交到版本库的时候会忽略，且不会记录其中的修改记录。

- 每一行代表一条规则。不带任何符号的文件名，代表所有路径的该文件都会被忽略。

- 以 `#` 开始的行，被视为注释。如果规则是以 `#` 开头，则可用 `\` 反斜杠转译。

- 斜杠 `/` 用作目录分隔符。如果尾部有 `/`，则只匹配文件夹，如果尾部没有 `/`，则即可匹配文件，也可匹配文件夹。如果头部或中间有 `/`，则表示基于  `.gitignore` 文件所在位置的相对路径，如 `a/b` 不会匹配 `c/a/b`。

- `*` 号可代表除了 `/` 之外的任何字符；`?` 号匹配除了 `/` 之外的任何 **一个** 字符。

- `**/` 号表示匹配所有目录，如 `**/node_modules` 表示任何目录下的 `node_modules` 文件或者文件夹，效果同 `node_modules`。

- `/**` 表示目录内无限深度的任何文件。如 `abc/**` 匹配 `abc` 目录下的所有文件。

- `/**/` 表示零个或多个目录。如 `a/**/b` 匹配 `a/b`，`a/x/b`，`a/x/y/b` 等等。

```r
# 注释
node_modules
dist
...
```

## 创建版本库

### 创建新的本地版本库

```shell
$ mkdir learngit  # make directory 新建文件夹
$ cd learngit     # 进入文件夹
$ git init        # 初始化仓库
```

初始化后文件夹里会多一个 `.git` 的隐藏文件夹，可通过命令 `ls -ah` 查看。

### 克隆远程版本库

```shell
$ git clone URL                #  clone 远程项目
$ git clone -b <远程分支> URL   #  clone 指定分支
$ git clone URL <文件夹名>      #  clone 远程项目到本地该文件目录下（会新建文件夹）
```

`git clone URL` 会克隆全部分支，但只能看到 `master` 分支，需要创建本地分支并关联到远程 `origin` 的对应分支，才能看到对应的分支。

## 项目文件有更改，需及时更新本地版本库

### 远程文件有改变 `git pull`

拉取最新项目文件，`git pull == git fetch + git merge`。

```shell
$ git pull   # git pull = git fetch + git merge
$ git pull origin <分支名>   # 拉取远程某分支代码
```

如果是团队合作开发，在每次修改本地文件之前，需 `pull` 一下最新代码，尽量减少冲突。如果 pull 的时候，提示有冲突，可使用以下方法解决：

- 先将本地更改 stash 存储起来，然后 pull，再解决冲突，然后在 add，commit，push。

- add commit 后 pull 下来解决冲突，完了后 再 commit 然后 push。

如果使用第二种方法解决冲突，会造成提交树分叉较多，不利于查看提交记录，因此可以使用 rebase 的方式 pull 代码。

```shell
$ git pull --rebase  # = git fetch + git rebase
# 解决冲突
$ git add
$ git rebase --continue
$ git push
```

### 本地文件有改变 

#### 1. 查看文件的改变情况：

先用 `git status` 查看当前工作区的状态（有变化的文件）：

```shell
$ git status      # 详细输出更改状态
$ git status -s   # 简短输出更改状态
```

如果显示文件被修改过，可用 `git diff` 查看修改内容：

```shell
$ git diff           # 是工作区(work dict)和暂存区(stage)的比较
$ git diff --cached  # 是暂存区(stage)和分支(master)的比较
$ git diff HEAD      # 查看工作区和版本库里面最新版本的区别，HEAD可以换成任何版本号(commit id)
```

#### 2. 用 `git add` 将文件添加到暂存区（staging area）：

```shell
$ git add README.md
$ git add .        # 全部有更改的文件
```

`git add` 后可写文件名，可写文件夹，可写点 `git add -A .` 表示添加全部有更改的文件，`-A` 表示包括被删除的文件。

#### 3. 用 `git checkout -- <file>` 丢弃工作区的修改

命令 `git checkout -- README.md` 意思就是，把`README.md` 文件在工作区的修改全部撤销，这里有两种情况：

- 一种是 `README.md` 自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；

- 一种是 `README.md` 已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。

总之，就是让这个文件回到最近一次 `git commit` 或 `git add` 时的状态。

#### 4. 用 `git reset HEAD <filename>` 撤销暂存区的修改，重新放回工作区。

如果不加文件名则表示撤销上次 `add` 的全部文件

```shell
git reset HEAD <filename>  # 取消暂存区的文件
```

#### 5. 最新版本中使用 `git restore` 代替了 `reset` 和 `checkout`

```shell
git restore <file>            # 丢弃工作区的更改
git restore --staged <file>   # 撤销暂存区 add 的文件，重新放回工作区。
```

#### 6. 用`git commit`将文件提交到本地仓库：

```shell
$ git commit -m "wrote a readme file"
$ git commit -am '修改文件'  # git add + git commit
```

将暂存区的更改提交到本地仓库，只有本机可见。`-m` 后面输入的是本次提交的说明，方便记录每次提交的改动，因此最好是有意义的说明。

## `commit` 后的版本回退

### 1. 先查看提交日志 

`git log` 命令可以显示从最近到最远的提交日志，如果觉得输出信息太多，可加上 `--pretty=oneline` 参数。

```shell
$ git log --pretty=oneline
0857d7f526f13b2a5eefdf73e811192bc9d63cb9 (HEAD -> master, origin/master, origin/HEAD) stage-4
100ff52732b102df98466bcceef550e24d9a5ce5 babel-loader
7d7643d2ea885c2a1332b25127eef497ca51869d babel
:           # 用 q 退出命令行
```

前面的一大串是提交记录的哈希值，也就是 `commit id`，可通过 `commit id` 的前四五位字符确定回退的版本。也可通过 `HEAD` 代表，`HEAD` 表示当前版本，也就是最新的提交 `0857d...`，上一个版本就是 `HEAD^`，上上一个版本就是 `HEAD^^`，往上 100 个版本可写成`HEAD~100`。

### 2. 通过 `git reset` 命令回退

```shell
$ git reset --hard HEAD^
HEAD is now at 100ff52 babel-loader
```

回退后，再 `git log` 就只能看到之前的提交记录，而不能看到回退之前的最新提交，此时，如果要撤销回退，就得找到最初的提交记录的哈希值。可通过 `git reflog` 查看。 `git reflog` 可显示所有的提交记录。

```shell
$ git reflog
100ff52 (HEAD -> master) HEAD@{0}: reset: moving to HEAD^
0857d7f (origin/master, origin/HEAD) HEAD@{1}: commit: stage-4
100ff52 (HEAD -> master) HEAD@{2}: commit: babel-loader
7d7643d HEAD@{3}: commit: babel
:
```

得知，之前的提交记录是 `0857d`，即可通过 `git reset` 恢复到最新提交。

```shell
$ git reset --hard 0857
HEAD is now at 0857d7f stage-4
```

## Git 分支管理

### 1. 列出分支，带 `*` 号的是当前分支

```shell
$ git branch   # 本地分支
* master
```

`git branch -a` 可列出本地和远程的分支。

```shell
$ git branch -a
* master
  remotes/origin/HEAD -> origin/master
  remotes/origin/gh-pages
  remotes/origin/master
```

上面的是本地分支，下方的有 `remotes/origin` 开头的就是远程分支。

### 2. 创建新分支 `git branch <分支名>` 

```shell
$ git branch bugFix
```

创建好的分支需要和远程分支关联，可使用：

```shell
$ git branch --set-upstream-to=origin/bugFix bugFix
# or
$  git branch --track origin/bugFix bugFix
```

### 3. 切换到新分支 `git checkout <分支名>` 

```shell
$ git checkout bugFix   
$ git commit            # 先切换分支再提交，就会提交到新建的分支上
```

### 4. 创建并切换到新分支 `git checkout -b <分支名>` 

```shell
$ git checkout -b bugFix
```

如果本地创建的分支需要和远程的分支关联，则可以使用：

```shell
$ git checkout -b dev origin/dev
```

### 5. 合并分支 

**`git merge <分支名>`**

```shell
$ git checkout master    # 切换到主分支
$ git merge bugFix       # 将 bugFix 分支合并到主分支上
``` 

`merge` 完如果有冲突，需要手动修改，然后再 `add` `commit` 告诉 Git 文件冲突已经解决。

合并分支时，Git会用 `Fast forward` 模式。若合并分支时，加上 `--no-ff` 参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而 `fast forward` 合并就看不出来曾经做过合并。

```shell
git merge --no-ff -m "merged bugFix" bugFix
```

**`git rebase <分支名>`**

```shell
$ git checkout bugFix
$ git rebase master     # 将 bugFix 的提交记录移动到 master分支上

$ git checkout master
$ git rebase bugFix     # 将 master 分支更新到移动过来的 bugFix 记录上
```

### 6. 删除分支 

合并完后就可以删除分支 `git branch -d <分支名>`：

```shell
$ git branch -d bugFix
```

如果要丢弃一个没有被合并过的分支，需要通过 `git branch -D <分支名>` 强行删除。

```shell
git branch -D feature
```

删除远程分支 `git push origin --delete <分支名>`：

```shell
$ git push origin --delete gh-pages
```

### 7. 最新版本的 Git 提供了新的 `git switch` 命令来切换分支

```shell
$ git switch master    # 切换到已有分支
$ git switch -c dev    # 创建并切换到新的 dev 分支
```

## 将本地仓库推送到远程仓库

### 1. 查看远程仓库 

```shell
$ git remote -v
```

### 2. 连接远程仓库 

通过 `git remote add` 命令连接 `remote name` (通常命名为 origin)和远程仓库的 URL。

新建的本地仓库若要推送到远程仓库，需要手动连接到要推送的远程仓库。

通过 `git clone` 克隆的远程项目，已经建立了连接，就不需要再连接远程仓库了。直接先 `pull` 再 `push` 就可以了。

```shell
$ git remote add origin URL
```

### 3. 修改远程仓库 

```shell
$ git remote remove origin    # 先移除之前的仓库
$ git remote add origin URL   # 再添加新的远程仓库
```

### 4. 推送 

推送就是将已经提交到本地仓库的那部分内容推送到远程在线仓库。修改了，但没提交的那部分内容，不会被推送。

若连接到的远程仓库中有项目，则需要先 `pull` 再提交。

```shell
$ git pull origin master   # 若远程仓库中项目已存在，则需要先 pull，merge一下有冲突的部分。
$ git add .
$ git commit -m "init"   # 将本地有改动的文件提交到本地仓库
```

将提交到本地仓库的部分内容推送到远程仓库，或者如果远程仓库是空的，没有项目，则可直接 `push`。

```shell
$ git push -u origin master
```

远程的名称是 `origin`，默认的本地分支名称是 `master`。`-u` 是告诉 Git 记住这些参数，把本地的 `master` 分支和远程的 `master` 分支关联起来，以便下次可以简单地运行 `git push`，Git 就知道该怎么做了。

如果本地 `dev` 要推送到远程的 `dev` 分支，则使用：

```shell
$ git push origin dev
```

**推送失败，解决冲突**

如果 push 失败，提示有最新的提交，则表示有小伙伴已经提交过一个版本了，此时需先用 `git pull` 把最新的提交拉取下来，如果有冲突需要在本地先手动解决冲突，解决后，commit 提交，然后再推送。

如果解决完冲突后认为提交分叉多比较乱，可在 push 前使用 `git rebase` 将分叉的提交变成一条直线，然后再推送。rebase 的目的是使得我们在查看历史提交的变化时更容易，因为分叉的提交需要三方对比。

### 5. 远程回退

**`git revert`** 远程撤销

`git revert` 会提交一次新的提交记录，该提交引入了更改，更改的内容就是回退撤销到上一次提交。之后就可以推送到远程了。

```shell
$ git revert HEAD
```

## `git stash` 储藏功能

`git stash` 会将当前工作区还没有提交到版本库的更改存储起来，但不会存储新建的文件，因为新建的文件还没有被 Git 管理。工作区会回到上次 `commit` 的状态，并且包含新建的文件。

```shell
$ git stash
Saved working directory and index state WIP on master: d21d76c git
```

`git stash list` 可以查看储存的列表。

```shell
$ git stash list
stash@{0}: WIP on master: d21d76c git
```

恢复储存的内容有两种方法：

- 一是用 `git stash apply` 恢复，但是恢复后，stash 内容并不删除，你需要用 `git stash drop` 来删除。
- 另一种方式是用 `git stash pop`，恢复的同时把stash内容也删了。

```shell
$ git stash pop
```

你可以多次 stash，恢复的时候，先用 `git stash list` 查看，然后恢复指定的 stash，用命令：

```shell
$ git stash apply stash@{0}
```

## 其它功能

### 在提交树上移动指针

```shell
git checkout HEAD^
git checkout <提交记录的哈希值>
```

强制修改分支位置

```shell
git branch -f master HEAD~3
```

上面的命令会将 master 分支强制指向 HEAD 的第 3 级父提交。

### 复制提交记录到当前分支

#### 知道提交记录的哈希值时

```shell
$ git cherry-pick <提交记录的哈希值> <...>
```

#### 不知道提交记录的哈希值

交互式 rebase 指的是使用带参数 --interactive 的 rebase 命令, 简写为 -i

如果你在命令后增加了这个选项, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。

在实际使用时，所谓的 UI 窗口一般会在文本编辑器 —— 如 Vim —— 中打开一个文件。 

当 rebase UI界面打开时, 你能做3件事:

- 调整提交记录的顺序
- 删除你不想要的提交
- 合并提交。

```shell
git rebase -i HEAD~3
```

### 修改之前提交的某一个记录

```shell
$ git rebase -i HEAD~2   # 先排序将需要修改的提交顺序排到最新
$ git commit --amend     # 修改记录
$ git rebase -i HEAD~2   #  再按照之前的顺序排序
```

## tag 标签管理

发布一个版本时，我们通常先在版本库中打一个标签（tag），这样，就唯一确定了打标签时刻的版本。将来无论什么时候，取某个标签的版本，就是把那个打标签的时刻的历史版本取出来。所以，标签也是版本库的一个快照。

Git 的标签虽然是版本库的快照，但其实它就是指向某个 commit 的指针，然而标签的指针不能移动，所以，创建和删除标签都是瞬间完成的。tag 就是一个让人容易记住的有意义的名字，它跟某个 commit 绑在一起。

### `git tag` 创建标签

在Git中打标签非常简单，首先，切换到需要打标签的分支上。然后用 `git tag <tagname>` 就可以打一个新标签。

如果不指定提交记录，Git 会用 HEAD 所指向的位置。

```shell
git tag v1.0 <提交记录>
```

还可以创建带有说明的标签，用 `-a` 指定标签名，`-m` 指定说明文字：

```shell
$ git tag -a v1.0 -m "version 0.1 released" 0857d
```

### 查看标签

`git tag` 查看标签列表，`git show <tagname>` 可查看标签信息

```shell
$ git tag
$ git show v1.0   # 查看标签信息
```

### 推送标签

```shell
$ git push origin <tagname>
```

或者，一次性推送全部尚未推送到远程的本地标签：

```shell
git push origin --tags
```

### 删除标签

存储在本地的标签可直接删除：

```shell
$ git tag -d v1.0
```

如果要删除已经推送到远程的标签，需要先删除本地，然后将本地的删除推送到远程：

```shell
$ git tag -d v1.0
$ git push origin :refs/tags/v1.0
```

- [git 学习动画](https://learngitbranching.js.org/)

- [廖雪峰 - Git 教程](https://www.liaoxuefeng.com/wiki/896043488029600)