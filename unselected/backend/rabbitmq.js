const amqp = require('amqplib');

// Setup RabbitMQ connection and channel
const exchangeName = 'poll_updates';
let channel = null;

const createFanoutExchange = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();

    channel.on('error', (err) => {
      console.log('Channel Closed', err);
    });

    // Create a fanout exchange
    const exchangeName = 'poll_updates';

    console.log(`Checking exchange: ${exchangeName}`);

    try {
      //if (!await checkExchange(connection)) {
        console.log(`Exchange ${exchangeName} does not exist. Create a new one`);
        try {
          await createExchange(connection);
          console.log(`Exchange ${exchangeName} created`);
        }
        catch (error) {
          console.error('Error creating exchange:', error);
          throw error;
        }
      //}
      // else {
      //   console.log(`Exchange ${exchangeName} already exists`);
      // }
    }
    catch (error) {
      console.error('Error checking exchange:', error);
      throw error;
    }

    console.log(`Fanout Exchange '${exchangeName}' is set up`);
    
  } catch (error) {
    console.error('Error creating exchange:', error);
  }
};

const checkExchange = async (connection) => {
  const channel = await connection.createChannel();
  try {
    await channel.checkExchange(exchangeName);
    return true;
  }
  catch (error) {
    return false;
  }
}

const createExchange = async (connection) => {
  const channel = await connection.createChannel();
  
  await channel.assertExchange(exchangeName, 'fanout', { durable: false });
  this.channel = channel;
}

const getChannel = () => {
  return channel;
}

module.exports = { createFanoutExchange, getChannel, exchangeName };