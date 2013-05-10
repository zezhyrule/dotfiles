#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return
[ -n "$TMUX" ] && export TERM=xterm-256color

# allows saving with ctrl-s in vim
vim()
{
    local STTYOPTS="$(stty --save)"
    stty stop '' -ixoff
    command vim "$@"
    stty "$STTYOPTS"
}

# use vi-style keybindings in shell
# starts in insert mode, esc to leave
set -o vi

# colored  man pages!
man() {
	env \
		LESS_TERMCAP_mb=$(printf "\e[1;31m") \
		LESS_TERMCAP_md=$(printf "\e[1;31m") \
		LESS_TERMCAP_me=$(printf "\e[0m") \
		LESS_TERMCAP_se=$(printf "\e[0m") \
		LESS_TERMCAP_so=$(printf "\e[1;44;33m") \
		LESS_TERMCAP_ue=$(printf "\e[0m") \
		LESS_TERMCAP_us=$(printf "\e[1;35m") \
			man "$@"
}

# Use bash-completion, if available
[[ $PS1 && -f /usr/share/bash-completion/bash_completion ]] && \
    . /usr/share/bash-completion/bash_completion

# PS1='\u \w > '
PS1='\[\e[m\]\u\[\e[m\] \[\e[34m\]\w\[\e[m\] \[\e[37m\]> \[\e[0m\]'

shopt -s autocd # cd to a dir just by typing its name
PROMPT_COMMAND='[[ ${__new_wd:=$PWD} != $PWD ]] && ls; __new_wd=$PWD' # ls after cding


#=====================
#  -All mah aliases-
#=====================

alias cd..='cd ..' # mah silly typos
alias ..='cd ..' 
alias ...='cd ../../../'
alias vim="stty stop '' -ixoff ; vim" # keep all my configs when run as root
alias svim='sudo vim'
alias vi='vim' # down with vi compatibility mode!
alias edit='vim'
alias emacs='vim'
alias vimrc='$EDITOR $HOME/dotfiles/.vimrc'
alias bashrc='$EDITOR $HOME/dotfiles/.bashrc'
alias visudo='sudo visudo'
alias gccw='gcc -Wall -Werror -o'
alias wifi='sudo wifi-menu'
alias urxvtc='$HOME/.scripts/urxvtc.sh'
alias extmon='$HOME/.scripts/extmon.sh'
alias ls='ls --color=auto' # pretty colors
alias ll="ls -lh"
alias la="ls -a"
alias lt="ll -rt"
alias lla="ls -la"
alias l.="ls -d .*"
alias grep='grep --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grepr='grep -r --color=auto'
alias grepi='grep -i --color=auto'
alias grepl='grep -l --color=auto'
alias pacman='pacman'
alias pacs='sudo pacman -S'
alias pacf='pacman -Ss'
alias pacup='sudo pacman -Syu'
alias pacr='sudo pacman -Rns'
alias pacqs='pacman -Qs'
alias pak='sudo packer -S'
alias pakup='sudo packer -Syu'
alias pakf='packer -Ss'
alias awrc='$EDITOR $HOME/.config/awesome/rc.lua'
alias awtheme='$EDITOR $HOME/.config/awesome/themes/default/theme.lua'
alias tmux='tmux -2uv' # for some reason this makes vim work in tmux
alias x='xmodmap $HOME/.Xmodmap'
alias reboot="sudo systemctl reboot"
alias poweroff="sudo systemctl poweroff"
alias shutdown="sudo systemctl poweroff"
alias halt="sudo shutdown -h now"
alias cp='cp -i'
alias mv='mv -i'
alias rm='rm -I'
alias ln='ln -i'
alias chown='chown --preserve-root'

export EDITOR="vim"
