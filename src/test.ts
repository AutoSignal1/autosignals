import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import bip38 from 'bip38';
import wif from 'wif';
const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;
const passPhraseKey = process.env.BIT_PHRASE;

const makeBtcTest = () => {
  const keyPair = ECPair.makeRandom();
  // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: TESTNET,
  });
  const privateWif = keyPair.toWIF();

  const encryptedKey = bip38.encrypt(keyPair.privateKey, keyPair.compressed, 'passPhraseKey');

  console.log({ encryptedKey, address, publicAddress: keyPair.publicKey });
};

const decrypt = () => {
  const decryptedKey = bip38.decrypt(
    '6PYPuHqDXxGfLP39Kwxy2YnBAECoMcX53B8vT14ui9D3hLjD77BL6VDH61',
    'passPhraseKey',
    function (status) {
      //console.log(status.percent) // will print the percent every time current increases by 1000
    },
  );
  const privateKeyWif = wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed);

  const ck = ECPair.fromWIF(privateKeyWif);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: ck.publicKey,
    network: TESTNET,
  });

  console.log({ address, privateKeyWif, privateKey: ck.privateKey.toString('hex') });
};

decrypt();
