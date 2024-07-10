import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      { name: 'Admin1', email: 'admin1@gmail.com', password: '12345678' },
      { name: '', email: 'user@gmail.com', password: '12345678' },
    ])
  }
}
