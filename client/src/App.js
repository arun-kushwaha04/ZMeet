import React from 'react';
import './App.css';
import {
 Header,
 Segment,
 Grid,
 Message,
 Button,
 Icon,
 Input,
 Divider,
 Label,
} from 'semantic-ui-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './Layout';

const Container = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 .ui.attached.header,
 .ui.attached.segment,
 .ui.message {
  background-color: transparent;
 }
`;

function App() {
 const navigate = useNavigate();

 React.useEffect(() => {
  const token = localStorage.getItem('userToken');
  console.log(token);
  if (token !== 'undefined' && token) {
  } else {
   navigate('/account', { replace: true });
  }
 }, [navigate]);
 return (
  <Layout>
   <Container text>
    <Grid columns={2} relaxed='very' stackable doubling>
     <Grid.Column width={8}>
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
       <Grid columns={3}>
        <Grid.Column>
         <Button icon fluid labelPosition='left' color='blue'>
          <Icon name='video' />
          Create A Room
         </Button>
        </Grid.Column>
        <Grid.Column width={1} verticalAlign='middle'>
         OR
        </Grid.Column>
        <Grid.Column textAlign='center'>
         <Input placeholder='Enter a code or link' labelPosition='right' action>
          <Label basic>
           <Icon name='users' />
          </Label>
          <input />
          <Button primary>
           <Link to='/:dfasf-asfas'>Join</Link>
          </Button>
          {/* <Button>Join</Button>
          <Select compact defaultValue='articles' /> */}
         </Input>
         {/* <Input type='text' placeholder='Search...' action>
          <input />
          <Select compact defaultValue='articles' />
          <Button type='submit'>Search</Button>
         </Input> */}
        </Grid.Column>
       </Grid>
      </Grid.Row>
     </Grid.Column>
     <Grid.Column width={8}>
      <Message>
       <Message.Header>ZMeet Features</Message.Header>
       <Message.List>
        <Message.Item>Get a link that you can share</Message.Item>
        <Message.Item>Redueced video/audio latency</Message.Item>
        <Message.Item>
         Peer to peer communication, no server involved
        </Message.Item>
        <Message.Item>In call chat communication</Message.Item>
       </Message.List>
      </Message>
     </Grid.Column>
    </Grid>
   </Container>
  </Layout>
 );
}

export default App;
