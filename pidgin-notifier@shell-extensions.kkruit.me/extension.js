/*
 * Copyright (C) 2012 Kury Kruitbosch <kkruit@gmail.com>
 *
 * This is a modified version of the message notifier plugin by 
 * Marco Barisione <marco@barisione.org>. It was modified to notify 
 * specificly Pidgin messages.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */

const Lang = imports.lang;
const Main = imports.ui.main;
const MessageTray = imports.ui.messageTray;
const St = imports.gi.St;

let label;

function MessageLabel() {
    this._init();
}

MessageLabel.prototype = {
    _init: function() {
        this.countLabel = new St.Label({style_class: 'message-label'});

        this.actor = new St.Button({name: 'messageButton',
                                    style_class: 'message-button'});
        this.actor.set_child(this.countLabel);

        this.updateCount();
    },

    updateCount: function() {
        let count = 0;

        let items = Main.messageTray._summaryItems;
        for (let i = 0; i < items.length; i++) {
            let s = items[i].source;
            if (s.title.search(/Pidgin/) >= 0) {
                count += parseInt(s._counterLabel.get_text());
            }
        }

        this.countLabel.visible = count > 0;
        this.countLabel.set_text(count.toString());
    }
};

function customSetCount(count, visible) {
    let fallbackSetCount = Lang.bind(this, originalSetCount);
    fallbackSetCount(count, visible);

    label.updateCount();
}

let originalSetCount;

function init() {
    originalSetCount = MessageTray.Source.prototype._setCount;

    label = new MessageLabel();
}

function enable() {
    MessageTray.Source.prototype._setCount = customSetCount;

    Main.panel._rightBox.insert_actor(label.actor, 0);
}

function disable() {
    MessageTray.Source.prototype._setCount = originalSetCount;

    Main.panel._rightBox.remove_actor(label.actor);
}
