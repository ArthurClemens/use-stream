# useStream

A React hook to work with streams.

Motivation: [Hooks and Streams](https://james-forbes.com/#!/posts/hooks-and-streams) by James Forbes. While the example code in this article uses [Mithril](https://mithril.js.org), `useStream` allows you to use streams in React applications.

## Features

* Enables React rendering whenever streams are updated
* `onMount` callback function for creating side effects
* `onDestroy` callback function for cleaning up (for example stopping streams)

Streams are memoized so that they are initialized only once.


## Usage

`npm install use-stream`

You can use any stream library. In these examples we'll use the lightweight stream module from Mithril, which comes separate from Mithril core code.

`npm install mithril`


## API

`useStream({ model, onMount?, onDestroy? }) => model`

`model` is a POJO object with streams as values: 

```js
const count = useStream({
  model: {
    count: stream(0),
  }
})
```

`onMount` is an optional callback function to be called at mount:

```
onMount: (model) => {
  // any side effects
}
```

`onDestroy` is an optional callback function to be called when the stream gets out of scope:

```
onDestroy: (model) => {
  // cleanup, for example:
  // model.count.end(true)
}
```

## Examples 

### Simple counter

[Live code example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOgAwFYA0IAxgPYB2AzsQskVbAIYAO58UIB5hATncgNpY8WALoEAZhATl+oUvTCIkIDAAsALmFjtapNfF00APFAgA3AATQAvAB0QTRnYB8hgPQnTT7SwSE1EMmklLCQAJiwQAF88WXlFZQAraQISXX01GlTyNXNsrnh5cytzAHcIUihiEowwDDyCsBtSCDBGYi4c4HMAVxYAZTV8wsjzMR4wczsMV174AaHGkCamrJywYih4WCLzAAoASiKnJvMe-sGG3eAT0-N1zdgkc2vSW9uSbt0n+vldrH28DdTpEbpF9stSKtzAAFegAc3gO0YPGYR2eNyhXQ+unMI2Ks3mlxeb3uWyexLe5mxam+F1+-0Br1uIKZYJuN3yam6XFeuyB5mMZipDHI5AAcnFbCBGPD4M5+adDCoAIxOYDUg6RNwq45Mt6GRi6ym3QwAI26ajUZAVlLIAGFYBBCABrKzAA5ojUaw4AWnMyv2LONbxM5HopoQUDd3qKVmKWCDwacABF4Nx4ApdG5zZayEbg2aLVbSDa3vbHS63R6rE4qcRPmpdjGANT+wOl8xOACSkPymbU2aLeZtbkN-LcHnz4NILJWgRyAEFGIwdtXaxTOdzXoZYQjzK5dbPSAAlAp+ZMAeQAshh8hV4FxdoYlyuD3hzA5p9oSK1JA+aKa4ZbN4Wxpv4gQ0KEADMSBQRE0SxAoNAEnStRJN+ZB6AYSgQvAAAebQdHWFA5ChCyrl0pKwO+ZBXvWug0aQqZ5MQACeuKHDW6JMlCCjrDsp70H4GCzKeYi7FR06nBepoJGBGDOvArHkBJGxbPsGBiO0ACiQkqLszpot0jBQPQeiqQ8fDOsI+xSTcgnCbM2liGIYF8nqeyceuNoQGIey0fRaiHBSxoBQ2EkZsQGCENyd5BTaiZvL5-lMfALGscFHabjynlomQzGDGxEXrNFsXpFJlKJbi758MINwVdlrx8VFMVcHFTRHq4ABUXVNF1MI8KY0BpR+rzGaZejmFa5gOTkJQqPo8CmA+H65Kh5gImo5A9CZZmsBgfWuHOJE7RNiLFD8ExcRSUJ8O+LBqAAavQsDdPAwgCWeagiece27KQ3SwLA072V9P3wM5rl+Lsa7cW8l01EwuwPc9r3wBV0TmLV04shhv4IFwAFAVoHCgX4AQUDQyohAA7FEMQgHISFKNFooYWk2EgKaGzsRSWm6D6YjyJIrHfPQFA+iwXC+QA3DcMowOUcJPNTjB4XLM4QhgMp7hSgEunCPCfFATwAMTwBbGunArJikMr5jhGrVt3PQXBwuUPpWowTyO+rHUQiqcOjJhPolPAEBwuoTw4FgWDO-zaiSxAABe8BPDTWBOzcYCu+7pBPHH-slqQObFuYral2QQc527HsIGINLmBgOAZhrkQgb44GU0oyoABxIMqdORKIICOqQzpBHwiHxEMwmbMtsDEIw-YYOhBDcloSjqGozBIK4MykIwzpwtFxBgK4s9qAAAsqABsGDKqE2AzGAUAX2D89bEvK9ryAaisYweInBpaMAyAhRmcQaCXx9JUWon9F7L3SKvZIIAN40G3rvfenwj4nx-O-ISidYE33vo-Z+3RX74L8DAs+GB4HfyQb-f+gCaDAIgKA+m08aCQDUCoaWsBJaoW0GgrelpMEHxwafc+3DeGSAEQsK+T8sDPwRowgBQDuBsIyKTTuFMgggEHigJAt9e4+gMUgXuUEogjyZvEWaa1yL4XkIwagkQgA)

```js
import stream from "mithril/stream"
import { useStream } from "use-stream"

const { count } = useStream({
  model: {
    count: stream(0),
  }
})

return (
  <div className="page">
    <h1>{count()}</h1>
    <p>
      <button
        onClick={() => count(count() - 1)}
        disabled={count() === 0}
      >Decrement</button>
      <button
        onClick={() => count(count() + 1)}
      >Increment</button>
    </p>
  </div>
)
```

### Example with James Forbes' useInterval

[Live code example](https://flems.io/#0=N4IgtglgJlA2CmIBcAWAnAOgAwFYA0IAxgPYB2AzsQskVbAIYAO58UIB5hATncgNpY8WALoEAZhATl+oUvTCIkIDAAsALmFjtapNfF00APFAgA3AATQAvAB0QTRnYB8hgPQnTT7SwSE1EMmklLCQAJiwQAF88WXlFZQAraQISXX01GlTyNXNsrnh5cytzAHcIUihiEowwDDyCsBtSCDBGYi4c4HMAVxYAZTV8wsjzMR4wczsMV174AaHGkCam11dzAGFiKHhzEjAFXXJzehz1NWYkVYS48gBaMXaAI3hyDD3XAGIAQlc27PJXCpiMQANZ3egVW71eTkJpZHKzACSaS4pnosCK5gAFF1tgwAJ7mSIASiKTnMwCa5l2gRy0Ex0LAWOJVJpFBy-kIIIZgwazNZrLx9HxNSYWNZ1KFhKs5MppGpCt2CHoXGRelR6Kx0GZLPlissUCxLDUavgGtgWM5ILw5ilNqlxN1isirKdkz1Uow+igosY4r11OZZIpEoVhGVqpRaIt2sdoZderdrPyam6XHlVqaCbhtPMYC28AxxRxlmaagAIoXhTbyhA1JturoSWTWbN5ny5Yr83ikCGAwqpb3GVqy5WCcS8KHqSRG2oh7z5CO6w3dBP45P+2QALLEWe9ksz3T2quE5syvv6tnZcxWzFIqOa3EnoluxVW31YoPnw9qLE-oMANTmAAjHG-bRKGZCVnkxD4vuXQ-seBIvsGnb6p63qWlw3TwK+RKsiSyykPCPRlpiwFYFgObsqWdZjsKmI4JRREkQAgowjCYowPDMKhrIkQhu5Hraz4jMU3aFiWtYVievbSfR+I1mWK5zuYWAvgKeopmm8r+oqxhmEq9DkOQABycS2CAjD0AA5vAzhTuYhgqMBTjAP+xKRG4LlOI5hiME4Cm9sAUrMiMYDkG4AV+dF-b6Y83RqGoZCOYqZDrLAEBclYwBfuSoWhaStykXWnmpQOEDkPQjwIFAOWFUUVjFI2dYJpe1KBfA3DwAcahuAlSVkL5cUKoYA3JaQ5XUulmXZblpLngVJ6ASVahlSNHXIt1vX9YlE3DZeUUHaN7hmMdurZqQABKBR+OWADyW4YPkFRmlihjsZxrhODaDi6toeyMJIZo0I81WFt4hZdf4gQ0AAbCEwG3AAzGgSARNEsQKDQbYLrUSQA2QegGEoRHwAAHm0HRXgi-R45iJYSbANrbkJags6Q0GDLBKHnmhJEKPmmI3fQfgYLMN1iFiTNuvdjwJNDGAgvA+LkNLBawMSGAPFwACiosqFi3Lnt0jBQCc8Dq3ifAgsIYHutSIti7MutiGI0N6QqeUXvqrOztLPXEG8aYvWtjkQGI2JQS83P4qSaGXtp6bYgt5LRzB+IB-mwdcKHeHUm1CrROYfDCK6ybwKmyeC0HhAh+kWZEa4ABUzdNM35gAAo8KY0AvMc8qm+beg3sQ5hOzkJQqPo8CmGaxy5PTdlqEcQ8Wz67euNR15ryPxSMnxeokXwNrGgAauiOHCMLt1qOLdMW1ipDdLAmtEY7t-3-Arvu34n6pz7akjIPzn0vrhAiNpS4XSaITVowMuCg3BloDgUM-ABAoDQUIcMkDASiDEEAchsZKDeCZQmaQSYgEeFsQkaEHi6HuPISQcFcgQjuCwLgEcADcrJrIwHKDZXsFFGDk24aQS6GBrJ2R9mDLkNkeCNigL2D48AVGiOpLwkwpABHmHCMItReYVQ2XKLcZKjBey6JEY3SapAXI+zoWoW4JR4AQBsuoXsTEsD6PsVCCAAAveAvYADsWA9GsjAIY8ovZPFWKaONMg5ggJxPlGhcJXAjGkFuAgMQqkMA4B6qIhMkNfAwwwUoYCOAcFRFECATKpAwQyAIXEGgQwxbbDnrAYgjBeoYAJgQNMWglBnAuKsRsjAQQ2TeMQMArgWlqAAALAThhgYCoRsAzDAFAGZn82mFk6d03pIA1D4kYPETgHDGAZExo0ohIBZm3EqLUHZHSunpB6ckEA-SaBDPIJcGYpAxkTPeHch5CylkrLWd0DZWzRYOIeRgJ5ezXkHKOScmgZyIAXLwVjeIkA1AqA4bAKEeNtCfMGUlYZfyAWTOmbi-FkgiULDmasrAazgHIuOac7gGKMgoOKegoIIBgKBJQEgOGAAOW4QqRViuRlUgghD4gT0XgscwFN5CMGoJEIAA)

```js
import stream from "mithril/stream"
import { useStream } from "use-stream"

// Code comments at https://james-forbes.com/#!/posts/hooks-and-streams
const useInterval = ({ delay }) => {
  const id = stream()
  const tick = stream()
  
  delay.map(
    delay => {
      clearInterval(id())
      id(setInterval(tick, delay, delay))
    }
  )
  
  delay.end.map(
    () => {
      clearInterval(id())
    }
  )
  
  return tick
}

const model = ({ initDelay, initCount}) =>
  useStream({
    model: {
      delay: stream(initDelay),
      count: stream(initCount),
    },
    onMount: ({ count, delay }) => {
      const tick = useInterval({ delay })
      tick.map(() => count(count() + 1))
    },
    onDestroy: ({ count, delay }) => {
      // Clean up
      delay.end(true)
    }
  })

const unit = 100
const initDelay = 500

const App = props => {
  const { count, delay } = model({ initDelay: initDelay, initCount: 0 })
  
  return (
    <div className="page">
      <h1>{count()}</h1>
      <p>Delay: {delay()} ms</p>
      <p>
        <button
          onClick={() => delay(delay() - unit)}
          disabled={delay() === unit}
        >Decrement</button>
        <button
          onClick={() => delay(delay() + unit)}
        >Increment</button>
      </p>
    </div>
  )
}
```

## Size

387 bytes gzipped
