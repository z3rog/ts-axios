import { parseHeaders, transformHeadersData, flattenHeaders } from '../../src/helpers/headers'

describe('helpers:header', () => {
  describe('parseHeaders', () => {
    test('should parse headers', () => {
      const parsed: any = parseHeaders(
        'Content-Type: application/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ': aa\r\n' +
          'key: '
      )

      expect(parsed['Content-Type']).toBe('application/json')
      expect(parsed['Connection']).toBe('keep-alive')
      expect(parsed['Transfer-Encoding']).toBe('chunked')
      expect(parsed['Date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['Key']).toBeUndefined()
    })

    test('should return empty object if headers is empty string', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })

  describe('transformHeadersData', () => {
    test('should normalize Content-Type header name', () => {
      const headers: any = {
        'conTenT-Type': 'foo/bar',
        'Content-length': 1024
      }
      transformHeadersData(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['conTenT-Type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })

    test('should set Content-Type if not set and data is PlainObject', () => {
      const headers: any = {}
      transformHeadersData(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should set not Content-Type if not set and data is not PlainObject', () => {
      const headers: any = {}
      transformHeadersData(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(transformHeadersData(undefined, {})).toBeUndefined()
      expect(transformHeadersData(null, {})).toBeNull()
    })
  })

  describe('flattenHeaders', () => {
    test('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }

      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    test('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }

      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'post')).toBeNull()
    })
  })
})
