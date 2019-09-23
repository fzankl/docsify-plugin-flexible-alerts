# docsify plugin: Flexible Alerts

![Build Status](https://api.travis-ci.org/zanfab/docsify-plugin-flexible-alerts.svg)
[![npm Version](https://img.shields.io/npm/v/docsify-plugin-flexible-alerts/latest.svg)](https://www.npmjs.com/package/docsify-plugin-flexible-alerts)
[![npm Downloads](https://img.shields.io/npm/dt/docsify-plugin-flexible-alerts.svg)](https://www.npmjs.com/package/docsify-plugin-flexible-alerts)

This docsify plugin converts blockquotes into beautiful alerts. Look and feel can be configured on a global as well as on a alert specific level so output does fit your needs (some examples are shown below). In addition, you can provide own alert types.

![Sample alerts created with plugin 'flexible-alerts'](https://user-images.githubusercontent.com/44210522/50688702-ea774f00-1026-11e9-9281-ca615cb466f5.jpg)

## Installation

### Step #1 - Update `index.html` file

Assuming you have a working [docsify](https://docsify.js.org) app set up, it is easy to use this plugin.

1. Add the following script tag to your `index.html`
2. In docsify setup configure the plugin so it does fit your needs. A custom setup is not mandatory.
3. By default style 'callout' and headings 'Note', 'Tip', 'Warning', 'Attention' will be used. You can change it using plugin configuration via `index.html` or for a single alert in your markdown files.

```html
<!-- Latest -->
<script src="https://unpkg.com/docsify-plugin-flexible-alerts"></script>
```

**Sample `index.html` file using style `flat` instead of `callout`**

```javascript
<script>
  window.$docsify = {
    'flexible-alerts': {
      style: 'flat'
    }
  };
</script>
```

**Sample `index.html` using custom headings**

```javascript
<script>
  window.$docsify = {
    'flexible-alerts': {
      note: {
        label: "Hinweis"
      },
      tip: {
        label: "Tipp"
      },
      warning: {
        label: "Warnung"
      },
      danger: {
        label: "Achtung"
      }
    }
  };
</script>
```

**Sample `index.html` using multilingual headings**

```javascript
<script>
  window.$docsify = {
    'flexible-alerts': {
      note: {
        label: {
          '/de-DE/': 'Hinweis',
          '/': 'Note'
        }
      },
      tip: {
        label: {
          '/de-DE/': 'Tipp',
          '/': 'Tip'
        }
      },
      warning: {
        label: {
          '/de-DE/': 'Warnung',
          '/': 'Warning'
        }
      },
      danger: {
        label: {
          '/de-DE/': 'Achtung',
          '/': 'Attention'
        }
      }
    }
  };
</script>
```

### Step #2 - docsify commands

Serve your documentation (`docsify serve`) as usual.

## Usage

To use the plugin just modify an existing blockquote and prepend a line matching pattern `[!type]`. By default types `NOTE`, `TIP`, `WARNING` and `DANGER` are supported. You can extend the available types by providing a valid configuration (see below for an example). 

```markdown
> [!NOTE]
> An alert of type 'note' using global style 'callout'.
```

```markdown
> [!NOTE|style:flat]
> An alert of type 'note' using alert specific style 'flat' which overrides global style 'callout'.
```

As you can see in the second snippet, output can be configured on alert level also. Supported options are listed in following table:

| Key            | Allowed value |
| --------------- | ---- |
| style | One of follwowing values: callout, flat |
| label  | Any text |
| icon  | A valid Font Awesome icon, e.g. 'fas fa-comment' |
| className  | A name of a CSS class which specifies the look and feel |
| labelVisibility | One of follwowing values: visible (default), hidden |
| iconVisibility  | One of follwowing values: visible (default), hidden |

Multiple options can be used for single alerts as shown below:

```markdown
> [!TIP|style:flat|label:My own heading|iconVisibility:hidden]
> An alert of type 'tip' using alert specific style 'flat' which overrides global style 'callout'.
> In addition, this alert uses an own heading and hides specific icon.
```

![Custom alert](https://user-images.githubusercontent.com/44210522/50689970-04676080-102c-11e9-9cbc-8af129cb988c.png)

As mentioned above you can provide your own alert types. Therefore, you have to provide the type configuration via `index.html`. Following example shows an additional type `COMMENT`.

```javascript
<script>
  window.$docsify = {
    'flexible-alerts': {
      comment: {
        label: "Comment",

        // localization
        label: {
          '/en-GB/': 'Comment',
          '/': 'Kommentar'
        },

        // Assuming that we use Font Awesome
        icon: "fas fa-comment",
        className: "info"
      }
    }
  };
</script>
```

In Markdown just use the alert according to the types provided by default.

```markdown
> [!COMMENT]
> An alert of type 'comment' using style 'callout' with default settings.
```

![Custom alert type 'comment'](https://user-images.githubusercontent.com/44210522/50722960-6f21a600-10d7-11e9-87e7-d40d87045afe.png)

Instead of configuring this plugin using key `flexible-alerts` you can use camel case notation `flexibleAlerts` as well.

```javascript
<script>
  window.$docsify = {
    'flexibleAlerts': {
      style: 'flat'
    }
  };
</script>
```

## Troubleshooting

If alerts do no look as expected, check if your `index.html` as well as alerts in Markdown are valid according to this documentation.

## Changelog

09/23/2019 - Fixed issue concerning custom Font Awesome icons when using on alert based level.

04/14/2019 - Added camel case support for plugin configuration key.

03/03/2019 - Fixed issue concerning languages using characters others than [a-z,A-Z,0-9] like Chinese or Russian.

01/19/2019 - Fixed issue when using plugin along with themeable plugin.

01/06/2019 - Initial release.