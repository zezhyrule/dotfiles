#!/bin/bash
################
# .make.sh
# Creates symlinks from ~ to dotfiles in ~/dotfiles
################

###### Variables

dir=~/dotfiles
files=".bashrc .vimrc .vim .minecraft .scripts .conkyrc .Xmodmap .xinitrc"

######
# change to dotfiles directory
echo -n "cding to $dir"
cd $dir
echo "done"

# create symlinks
for file in $files; do
	echo "Creating symlink to $file in ~"
	ln -s $dir/$file ~/.$file
done
