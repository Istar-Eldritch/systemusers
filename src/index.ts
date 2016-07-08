import {get} from 'config';
import {spawn} from 'child_process';

const fetch = require('node-fetch');

const adminToken = get<string>('admin_token');
const organization = get<string>('organization');

const api = `https://api.github.com/orgs/${organization}/members`;

const headers = new fetch.Headers();

headers.set('Accept', 'application/json');
headers.set('Authorization', `Token ${adminToken}`);

function createUser(username: string): Promise<string> {
  return new Promise((sucess, failure) => {
    let p = spawn('sh', ['src/adduser.sh', username]);

    p.stdout.on('exit', (code) => {
      if (code) {
        failure(`${username} could not be created`);
      }
      else {
        sucess(username);
      }
    });

  });
}

async function getUsers(): Promise<void> {

  let usersRequest = await fetch(
    api,
    {
      headers: headers
    }
  );

  let usersResponse = await usersRequest.json();

  if (usersRequest.ok) {
    await Promise.all(usersResponse.map(async (user) => {
      await createUser(user.login);
      console.log(`User ${user.login} created`);
    }));
  }
  else {
    // Something horrible happened;
    console.error(usersResponse);
  }

}

getUsers()
.then(() => {
  console.log('done!');
})
.catch((err) => {
  console.error(err);
});
