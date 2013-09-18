#!/bin/sh
#
# ~/.xinitrc
#
# Executed by startx (run your window manager from here)

if [ -d /etc/X11/xinit/xinitrc.d ]; then
  for f in /etc/X11/xinit/xinitrc.d/*; do
    [ -x "$f" ] && . "$f"
  done
  unset f
fi

# shift acts as esc when tapped, control as ctrl-o for vim
xcape -e 'Shift_L=Escape;Control=Control_L|o' &
xmodmap ~/.Xmodmap & # custom keymap for x
xrdb -merge ~/.Xresources & # terminal colors and stuff

case $1 in
bspwm)
    sxhkd &
    exec bspwm
    ;;
openbox)
    synapse &
    exec openbox-session
    ;;
awesome|*)
    #urxvtd &
    exec awesome
    ;;
esac
