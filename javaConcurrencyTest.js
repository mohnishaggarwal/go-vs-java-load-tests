import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '5m',
  thresholds: {
    // Fail the test if more than 1% of requests fail
    http_req_failed: ['rate<0.01'],
    // Fail if 95th percentile of request times exceed 2 seconds
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = 'http://JavaSe-JavaS-VfB6FvgZcmgP-1729113388.us-east-1.elb.amazonaws.com/api/products';

let ID_COUNTER = '1';

export default function () {
  const initialPayload = JSON.stringify({
    id: ID_COUNTER,
    name: 'Apple',
    price: 13.0,
  });

  const finalPayloadObj = {
    id: ID_COUNTER,
    name: 'Apple',
    price: 14.5,
  };
  const finalPayload = JSON.stringify(finalPayloadObj);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postRes = http.post(BASE_URL, initialPayload, params);
  check(postRes, {
    'POST has 2xx status': (r) => r.status >= 200 && r.status < 300,
  });
  sleep(0.5);

  const getRes1 = http.get(`${BASE_URL}/${ID_COUNTER}`);
  check(getRes1, {
    'First GET has 2xx status': (r) => r.status >= 200 && r.status < 300,
  });
  sleep(0.5);

  const putRes = http.put(`${BASE_URL}/${ID_COUNTER}`, finalPayload, params);
  check(putRes, {
    'PUT has 2xx status': (r) => r.status >= 200 && r.status < 300,
  });
  sleep(0.5);

  const getRes2 = http.get(`${BASE_URL}/${ID_COUNTER}`);
  check(getRes2, {
    'Second GET has 2xx status': (r) => r.status >= 200 && r.status < 300,
  });
  sleep(0.5);

  ID_COUNTER = (parseInt(ID_COUNTER, 10) + 1).toString();

  sleep(1);
}