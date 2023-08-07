const fs = require('fs');
const axios = require('axios');

const scanTag = 'poll';
const tag = encodeURI(scanTag);

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://www.patreon.com/api/posts?include=campaign%2Caccess_rules%2Cattachments%2Caudio%2Caudio_preview.null%2Cimages%2Cmedia%2Cnative_video_insights%2Cpoll.choices%2Cpoll.current_user_responses.user%2Cpoll.current_user_responses.choice%2Cpoll.current_user_responses.poll%2Cuser%2Cuser_defined_tags%2Cti_checks&fields\\[campaign\\]=currency%2Cshow_audio_post_download_links%2Cavatar_photo_url%2Cavatar_photo_image_urls%2Cearnings_visibility%2Cis_nsfw%2Cis_monthly%2Cname%2Curl&fields\\[post\\]=change_visibility_at%2Ccomment_count%2Ccommenter_count%2Ccontent%2Ccurrent_user_can_comment%2Ccurrent_user_can_delete%2Ccurrent_user_can_view%2Ccurrent_user_has_liked%2Ccurrent_user_can_report%2Cembed%2Cimage%2Cimpression_count%2Cinsights_last_updated_at%2Cis_paid%2Clike_count%2Cmeta_image_url%2Cmin_cents_pledged_to_view%2Cpost_file%2Cpost_metadata%2Cpublished_at%2Cpatreon_url%2Cpost_type%2Cpledge_url%2Cpreview_asset_type%2Cthumbnail%2Cthumbnail_url%2Cteaser_text%2Ctitle%2Cupgrade_url%2Curl%2Cwas_posted_by_campaign_owner%2Chas_ti_violation%2Cmoderation_status%2Cpost_level_suspension_removal_date%2Cpls_one_liners_by_category%2Cvideo_preview%2Cview_count&fields\\[post_tag\\]=tag_type%2Cvalue&fields[user]=image_url%2Cfull_name%2Curl&fields\\[access_rule\\]=access_rule_type%2Camount_cents&fields[media]=id%2Cimage_urls%2Cdownload_url%2Cmetadata%2Cfile_name&fields\\[native_video_insights\\]=average_view_duration%2Caverage_view_pct%2Chas_preview%2Cid%2Clast_updated_at%2Cnum_views%2Cpreview_views%2Cvideo_duration&filter[campaign_id]=1370951&filter\\[contains_exclusive_posts\\]=true&filter[is_draft]=false&filter[tag]=${tag}&sort=-published_at&json-api-version=1.0`,
  headers: {
    'authority': 'www.patreon.com',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/vnd.api+json',
    'cookie': 'a_csrf=s4nqOlBDTNg3_SnMWYdHDOfyalAsmcUC-vhMUc_RJx8; patreon_locale_code=en-US; patreon_location_country_code=VN; patreon_device_id=bb96f4fe-47c9-4613-ad1c-21e0cba1c71b; _ga=GA1.1.93374639.1691374771; analytics_session_id=920b098f-2d39-43d0-887e-0efb3bde4672; _ketch_consent_v1_=eyJhbmFseXRpY3NiaXplbmhhbmNlIjp7InN0YXR1cyI6ImdyYW50ZWQiLCJjYW5vbmljYWxQdXJwb3NlcyI6WyJhbmFseXRpY3MiXX0sImFuYWx5dGljc3N2Y2VuaGFuY2UiOnsic3RhdHVzIjoiZ3JhbnRlZCIsImNhbm9uaWNhbFB1cnBvc2VzIjpbInByb2RfZW5oYW5jZW1lbnQiXX0sIm1hcmtldHJlbGV2YW50c3ZjcyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiZW1haWxfbWt0ZyJdfSwicHJldmVudGZyYXVkY29tcGx5bGF3cyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiZXNzZW50aWFsX3NlcnZpY2VzIl19LCJzdWJzY3JpYmVkc3ZjcyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiZXNzZW50aWFsX3NlcnZpY2VzIl19LCJzdXJ2ZXlvdXRyZWFjaCI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsicHJvZF9lbmhhbmNlbWVudCJdfSwidGFyZ2V0ZWRhZHZlcnRpc2luZyI6eyJzdGF0dXMiOiJncmFudGVkIiwiY2Fub25pY2FsUHVycG9zZXMiOlsiYmVoYXZpb3JhbF9hZHZlcnRpc2luZyJdfX0%3D; __ssid=781c3970afec335222e6c44908b3912; g_state={"i_l":0}; group_id=68110a01e9c4557f019ef35377af4c79da1615c8ede2c3ef3c2c99a92c41034e; _ALGOLIA=anonymous-4457ce4e-0c03-463d-b520-25a9d3a8d97a; session_id=22HhK71ukE0jcvgNVbsrmyTLzPU59mUcx1gSHRyXrM0; __cf_bm=ZLjQbPgfovNJfnlOv.QpZ5wVmmkygbjPBW3m_FYTF8k-1691376579-0-ARAHmbcJgpoDOfx5QdMHWDjDsCW4n7HsEdR0Z3yMjVZbm9k2wapv7P3YHhOw3n0pb2P2iJ7iogR73T3wbtxNy24gE4rRCWfU5XaOl8vAQB/o; _swb_consent_=eyJlbnZpcm9ubWVudENvZGUiOiJwcm9kdWN0aW9uIiwiaWRlbnRpdGllcyI6eyJwYXRyZW9uYWNjdGlkIjoiOTQ1MjE2OTkiLCJwYXRyZW9uZGV2aWNlaWQiOiJiYjk2ZjRmZS00N2M5LTQ2MTMtYWQxYy0yMWUwY2JhMWM3MWIiLCJ2aXNpdG9ySUQiOiI5NDUyMTY5OSJ9LCJqdXJpc2RpY3Rpb25Db2RlIjoiZGVmYXVsdCIsInByb3BlcnR5Q29kZSI6InBhdHJlb24iLCJwdXJwb3NlcyI6eyJhbmFseXRpY3NiaXplbmhhbmNlIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJkaXNjbG9zdXJlIn0sImFuYWx5dGljc3N2Y2VuaGFuY2UiOnsiYWxsb3dlZCI6InRydWUiLCJsZWdhbEJhc2lzQ29kZSI6ImRpc2Nsb3N1cmUifSwibWFya2V0cmVsZXZhbnRzdmNzIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJjb25zZW50X29wdG91dCJ9LCJwcmV2ZW50ZnJhdWRjb21wbHlsYXdzIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJkaXNjbG9zdXJlIn0sInN1YnNjcmliZWRzdmNzIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJkaXNjbG9zdXJlIn0sInN1cnZleW91dHJlYWNoIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJjb25zZW50X29wdG91dCJ9LCJ0YXJnZXRlZGFkdmVydGlzaW5nIjp7ImFsbG93ZWQiOiJ0cnVlIiwibGVnYWxCYXNpc0NvZGUiOiJkaXNjbG9zdXJlIn19LCJjb2xsZWN0ZWRBdCI6MTY5MTM3NzMxOX0%3D; _ga_JF55G82FNT=GS1.1.1691374771.1.1.1691377521.0.0.0; _dd_s=rum=0&expire=1691378544691; AWSALBTG=QXVbhqVyr3OsHndM7nb0157WFhdswgL2fGFyWgFmo3WqJpjCVAKhBiBu0qDg+80RV6u/mvRD5Dtp0tMpjVRC2X74a2YXO2G733QVHGDxaQCxhYnfwIMw6TA7zXWYDxAndPwTVyvLd42b0ErJw2/6tvpd7BsoaxbhVujyDWn3MgnMX/PZRAw=; AWSALBTGCORS=QXVbhqVyr3OsHndM7nb0157WFhdswgL2fGFyWgFmo3WqJpjCVAKhBiBu0qDg+80RV6u/mvRD5Dtp0tMpjVRC2X74a2YXO2G733QVHGDxaQCxhYnfwIMw6TA7zXWYDxAndPwTVyvLd42b0ErJw2/6tvpd7BsoaxbhVujyDWn3MgnMX/PZRAw=; AWSALBTG=kwSixr6Xr6xEiUdFO61hwoEyycOmZuRXilZJVXmGtgYlQDM0s2ZZ57DqDKNBx9/qQ/QVwv6TKDYnjmHpQWa1Gq/qVTKcpIyIKGNb5PmRFK85CSUYb7dJhKR7LDkNQG6AnNVGvMgduxlGpw5KN2faVTUczQ+s6QX/fNydPtVCW+jL; AWSALBTGCORS=kwSixr6Xr6xEiUdFO61hwoEyycOmZuRXilZJVXmGtgYlQDM0s2ZZ57DqDKNBx9/qQ/QVwv6TKDYnjmHpQWa1Gq/qVTKcpIyIKGNb5PmRFK85CSUYb7dJhKR7LDkNQG6AnNVGvMgduxlGpw5KN2faVTUczQ+s6QX/fNydPtVCW+jL',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  }
};

(async () => {
  console.log(`Scanning tag: ${scanTag}`);
  let next;
  let results = [];
  try {
    do {
      const response = await axios.request(config);
      results = [...results, ...response.data.data.map(item => {
        let url = '';
        let thumbnail = '';
        if(item.attributes.thumbnail) {
          thumbnail = item.attributes.thumbnail.url;
        } else if(item.attributes.image) {
          thumbnail = item.attributes.image.url;
        }
        let result = {
          title: item.attributes.title,
          url,
          thumbnail
        }
        return result;
      })];
      console.log(`Got ${results.length}/${response.data.meta.pagination.total} posts`)
      next = null;
      if(response.data.links) {
        next = response.data.links.next;
      }
      config.url = next;
      fs.writeFileSync(scanTag.split(' ').join('_').toLowerCase() + '.json', JSON.stringify(results));
      // sleep 1s
      await new Promise(r => setTimeout(r, 10000));

    } while (next);
  } catch (err) {
    console.log(err);
  }

  // console.log(results);
})();
