#!/bin/bash
################
# .make.sh
# Creates symlinks from ~ to dotfiles in ~/dotfiles
################

###### Variables

dir=~/dotfiles
olddir=~/dotfiles_old
files="bashrc vimrc vim config minecraft scripts conkyrc"

######

# create dotfiles_old in homedir
echo -n "Creating $olddir for backup of dotfiles in ~"
mkdir -p $olddir
echo "done"

# change to dotfiles directory
echo -n "cding to $dir"
cd $dir
echo "done"

# move any existing dotfiles in ~ to olddir, then create symlinks
for file in $files; do
	echo "Moving dotfiles from ~ to $olddir"
	mv ~/.$file ~/dotfiles_old/
	echo "Creating symlink to $file in ~"
	ln -s $dir/$file ~/.$file
done
