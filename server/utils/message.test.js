const expect = require('expect');

var {generateMsg} = require('./message')

describe('generate msg', () =>{
  it('should generate the correct message object', () => {
    var from = 'Ben';
    var text = 'Some message';
    var msg = generateMsg(from, text);

    expect(typeof msg.createdAt).toBe('number')
    expect(msg).toMatchObject({
      from,
      text
    });
  });

});
