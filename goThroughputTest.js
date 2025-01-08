import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 175 },
        { duration: '2m', target: 175 },
        { duration: '30s', target: 0 }, // ramp down to 0
    ],

    thresholds: {
        // Fail if more than 1% of requests fail
        http_req_failed: ['rate<0.01'],
        // Fail if 95th percentile of request times exceed 2 seconds
        http_req_duration: ['p(95)<2000'],
    },
};

export default function () {
    const url = 'http://GoServ-GoSer-gJAWRJZgsgRf-1231621137.us-east-1.elb.amazonaws.com/api/products/1';

    const res = http.get(url);

    check(res, {
        'status is 2xx': (r) => r.status >= 200 && r.status < 300,
    });

    sleep(0.5);
}
