import React from 'react';
import {
 Checkbox,
 Divider,
 Header,
 Segment,
 Sidebar,
 Reveal,
 Icon,
} from 'semantic-ui-react';
import styled from 'styled-components';

export default function Videodiv({ visible, setVisiblity }) {
 return (
  <Maindiv>
   <Segmentdiv>
    <Sidebar.Pusher>
     <Segment basic>
      <Header as='h3'>Application Content</Header>
      <Divider vertical />
      <Checkbox
       checked={visible}
       label={{ children: <code>Show Chats</code> }}
       onChange={(e, data) => setVisiblity(data.checked)}
      />
     </Segment>
    </Sidebar.Pusher>
   </Segmentdiv>
   <Animateddiv>
    <Reveal animated='move down'>
     <Reveal.Content visible style={{ width: '100%' }}>
      <Div />
     </Reveal.Content>
     <Reveal.Content hidden>
      <Controldiv>
       <Icon circular inverted color='green' name='video' size='large' />
       <Icon circular inverted color='green' name='unmute' size='large' />
      </Controldiv>
     </Reveal.Content>
    </Reveal>
   </Animateddiv>
  </Maindiv>
 );
}
const Maindiv = styled.div`
 height: 100%;
 width: 100%;
`;

const Segmentdiv = styled.div`
 height: 100%;
`;

const Animateddiv = styled.div`
 width: 100%;
 position: fixed;
 bottom: 0rem;
 i {
  cursor: pointer;
 }
`;

const Div = styled.div`
 background-color: #fceefc;
 height: 5rem;
 width: 100%;
 cursor: pointer;
`;

const Controldiv = styled.div`
 background-color: white;
 width: 100%;
 height: 5rem;
 padding: 1rem 0;
 display: flex;
 gap: 2rem;
 justify-content: center;
 align-items: center;
`;
