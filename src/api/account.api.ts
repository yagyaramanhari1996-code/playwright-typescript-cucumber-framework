import { APIRequestContext } from 'playwright';

export class AccountApi {
  constructor(private readonly api: APIRequestContext) {}

  // POST - Create account
  async createAccount(user: {
    name: string;
    email: string;
    password: string;
  }) {
    return await this.api.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: '10',
        birth_month: '5',
        birth_year: '1995',
        firstname: 'Playwright',
        lastname: 'Automation',
        company: 'QA Demo',
        address1: '1 Test Street',
        address2: 'Automation Park',
        country: 'India',
        zipcode: '600001',
        state: 'Tamil Nadu',
        city: 'Chennai',
        mobile_number: '9000000000',
      },
    });
  }

  // DELETE - Delete account
  async deleteAccount(email: string, password: string) {
    return await this.api.delete('/api/deleteAccount', {
      form: {
        email,
        password,
      },
    });
  }

  // GET - Get user details by email
  async getUserByEmail(email: string) {
    return await this.api.get('/api/getUserDetailByEmail', {
      params: {
        email,
      },
    });
  }
async verifyLogin(email: string, password: string) {
  return await this.api.post('/api/verifyLogin', {
    form: {
      email,
      password,
    },
  });
}


}