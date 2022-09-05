import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

export default function Participantsdiv() {
 return (
  <Menu vertical>
   <Menu.Item header>Participants</Menu.Item>
   <Menu.Item>
    <Icon name='mute' />
    <Icon name='video' />
    You
   </Menu.Item>
   <Menu.Item>
    <Icon name='unmute' />
    <Icon name='hide' />
    Anubhav
   </Menu.Item>
   <Menu.Item>
    <Icon name='unmute' />
    <Icon name='hide' />
    Chirag
   </Menu.Item>
  </Menu>
 );
}
