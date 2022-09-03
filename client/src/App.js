import './App.css';
import {
 Header,
 Segment,
 Grid,
 List,
 Button,
 Icon,
 Input,
 Divider,
} from 'semantic-ui-react';
import styled from 'styled-components';
// import Video from './components/video';
import Layout from './Layout';

const Container = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 .ui.attached.header,
 .ui.attached.segment {
  background-color: transparent;
 }
`;

function App() {
 return (
  <Layout>
   <Container text>
    <Grid columns={2} relaxed='very' stackable doubling>
     <Grid.Column>
      <Grid.Row>
       <Header as='h2' attached='top'>
        ZMeet
       </Header>
       <Segment attached>
        Premium vidoe meetings. Now free for everyone. We re-engineered the
        service that we build for secure business meetings, ZMeet, to make it
        free and avialable for all.
       </Segment>
      </Grid.Row>
      <Divider hidden />
      <Grid.Row>
       <Grid columns={3} textAlign='center'>
        <Grid.Column>
         <Button icon fluid labelPosition='left' color='blue' wid>
          <Icon name='video' />
          Create A Room
         </Button>
        </Grid.Column>
        <Grid.Column width={1} textAlign='center' verticalAlign='middle'>
         OR
        </Grid.Column>
        <Grid.Column>
         <Input
          icon='users'
          iconPosition='left'
          placeholder='Enter a code or link'
         />
        </Grid.Column>
       </Grid>
      </Grid.Row>
     </Grid.Column>
     <Grid.Column>
      <List bulleted>
       <List.Item>
        <Header size='medium'>Get a link that you can share</Header>
       </List.Item>
       <List.Item>
        <Header size='medium'>Redueced video/audio latency</Header>
       </List.Item>
       <List.Item>
        <Header size='medium'>
         Peer to peer communication, no server involved
        </Header>
       </List.Item>
       <List.Item>
        <Header size='medium'>In call chat communication</Header>
       </List.Item>
      </List>
     </Grid.Column>
    </Grid>
   </Container>
  </Layout>
 );
}

export default App;
