import { Request, Response } from "express"
import { parserRss } from "../../../utils/parser"
import { replaceQueryParams } from "../../../utils/replaceQueryParams"
import { DataResponse, TypeDetik, ZoneDetik } from "../../../types/common"
import { useSearch } from "../../../utils/useSearch"
import { RSS_DETIK_NEWS } from "../../../const"

interface Params {
  type?: TypeDetik
  zone?: ZoneDetik
}

interface Title {
  title: string
}

class DetikNews {
  static async getNews(req: Request, res: Response) {
    try {
      const { type, zone }: Partial<Params> = req.params
      const { title }: Partial<Title> = req.query
      let url = RSS_DETIK_NEWS.replace("{type}", type)
        .replace("{zone}", zone)
      const result = await parserRss(url)
      const data = result.items.map((items) => {
        const image = replaceQueryParams(items.enclosure.url, "q", "100")
        delete items.pubDate
        delete items["content:encoded"]
        delete items["content:encodedSnippet"]
        delete items.content
        delete items.guid
        items.image = {
          small: items.enclosure.url,
          large: image,
        }
        delete items.enclosure
        return items
      })
      if (title !== undefined) {
        const search = useSearch(data, title)
        let dataSearch: any = []
        search.map((items) => {
          dataSearch.push(items.item)
        })
        const dataResponse: DataResponse = {
          code: 200,
          status: "OK",
          messages: `Result of type ${type} news in Detik News with title search: ${title}`,
          total: search.length,
          data: dataSearch,
        }
        return res.status(200).send(dataResponse)
      }
      const dataResponse: DataResponse = {
        code: 200,
        status: "OK",
        messages: `Result of type ${type} news in Detik News`,
        total: data.length,
        data: data,
      }
      return res.status(200).send(dataResponse)
    } catch (e) {
      return res.status(500).send({
        message: `${e.message}`,
      })
    }
  }

  static async getAllNews(req: Request, res: Response) {
    try {
      const { zone }: Partial<Params> = req.params;
      const url = RSS_DETIK_NEWS
        .replace("/{type}", "")
        .replace("{zone}", zone || "news")
      const { title }: Partial<Title> = req.query
      const result = await parserRss(url)
      const data = result.items.map((items) => {
        const image = replaceQueryParams(items.enclosure.url, "q", "100")
        delete items.pubDate
        delete items["content:encoded"]
        delete items["content:encodedSnippet"]
        delete items.content
        delete items.guid
        items.image = {
          small: items.enclosure.url,
          large: image,
        }
        delete items.enclosure
        return items
      })
      if (title !== undefined) {
        const search = useSearch(data, title)
        let dataSearch: any = []
        search.map((items) => {
          dataSearch.push(items.item)
        })
        const dataResponse: DataResponse = {
          code: 200,
          status: "OK",
          messages: `Result of all news in Detik News with title search: ${title}`,
          total: search.length,
          data: dataSearch,
        }

        return res.status(200).send(dataResponse)
      }
      const dataResponse: DataResponse = {
        code: 200,
        status: "OK",
        messages: `Result of all news in Detik News`,
        total: data.length,
        data: data,
      }
      return res.status(200).send(dataResponse)
    } catch (e) {
      return res.status(500).send({
        message: `${e.message}`,
      })
    }
  }
}

export default DetikNews
