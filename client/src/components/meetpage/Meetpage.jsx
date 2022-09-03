import React from 'react';
import Layout from '../../Layout';
import { Grid, Segment, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';
import Videodiv from './Videodiv';
import Participantsdiv from './Participantsdiv';
import Chats from './Chats';

const Container = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 .ui.grid {
  background-color: transparent;
  width: 100%;
 }
 .ui.segment {
  background-color: transparent;
 }
 .ui.vertical.menu {
  margin-top: 10px;
 }
`;

export default function Meetpage() {
 const [isChatsVisible, setChatVisiblity] = React.useState(true);
 return (
  <Layout>
   <Container>
    <Participantsdiv />
    <Grid padded columns={1}>
     <Grid.Column>
      <Sidebar.Pushable as={Segment}>
       <Chats visible={isChatsVisible} setVisiblity={setChatVisiblity} />
       <Videodiv visible={isChatsVisible} setVisiblity={setChatVisiblity} />
      </Sidebar.Pushable>
     </Grid.Column>
    </Grid>
   </Container>
  </Layout>
 );
}
