import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import ThreadValidator from 'App/Validators/ThreadValidator'

export default class ThreadsController {
  public async index({ response }: HttpContextContract) {
    try {
      const threads = await Thread.query().preload('user').preload('category').preload('replies')
      return response.status(201).json({
        data: threads,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }
  public async store({ request, response, auth }: HttpContextContract) {
    const validateData = await request.validate(ThreadValidator)
    try {
      const thread = await auth.user?.related('threads').create(validateData)
      await thread?.load('user')
      await thread?.load('category')
      return response.status(201).json({
        data: thread,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const thread = await Thread.query()
        .where('id', params.id)
        .preload('category')
        .preload('user')
        .preload('replies')
        .firstOrFail()
      return response.status(201).json({
        data: thread,
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Thread not found',
      })
    }
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    try {
      const thread = await Thread.findOrFail(params.id)
      const user = auth.user

      if (user?.id !== thread.userId) {
        return response.status(401).json({
          message: 'Unauthorized',
        })
      }

      const validateData = await request.validate(ThreadValidator)
      await thread.merge(validateData).save()

      await thread?.load('user')
      await thread?.load('category')

      return response.status(200).json({
        data: thread,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    try {
      const thread = await Thread.findOrFail(params.id)
      const user = auth.user

      if (user?.id !== thread.userId) {
        return response.status(401).json({
          message: 'Unauthorized',
        })
      }

      await thread.delete()
      return response.status(200).json({
        message: 'Thread deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }
}
