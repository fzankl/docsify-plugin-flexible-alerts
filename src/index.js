// eslint-disable-next-line no-unused-vars
import styles from './style.css';

(function () {
  const CONFIG = {
    style: 'callout',
    note: {
      label: 'Note',
      icon: 'fas fa-info-circle',
      className: 'info'
    },
    tip: {
      label: 'Tip',
      icon: 'fas fa-lightbulb',
      className: 'tip'
    },
    warning: {
      label: 'Warning',
      icon: 'fas fa-exclamation-triangle',
      className: 'warning'
    },
    danger: {
      label: 'Attention',
      icon: 'fas fa-ban',
      className: 'danger'
    }
  };

  function mergeObjects(obj1, obj2, level = 0) {
    for (const property in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[property].constructor === Object && level < 1) {
          obj1[property] = mergeObjects(obj1[property], obj2[property], level + 1);
        } else {
          obj1[property] = obj2[property];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[property] = obj2[property];
      }
    }

    return obj1;
  }

  const install = function (hook, vm) {
    const options = mergeObjects(CONFIG, vm.config['flexible-alerts'] || vm.config.flexibleAlerts);

    const findSetting = function findAlertSetting(input, key, fallback, callback) {
      const match = (input || '').match(new RegExp(`${key}:(([\\s\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF-]*))`));

      if (!match) {
        return callback ? callback(fallback) : fallback;
      }

      return callback ? callback(match[1]) : match[1];
    };

    hook.afterEach(function (html, next) {
      const modifiedHtml = html.replace(/<\s*blockquote[^>]*>(?:<p>|[\S\n]*)?\[!(\w*)((?:\|[\w*:[\s\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF-]*)*?)\]([\s\S]*?)(?:<\/p>)?<\s*\/\s*blockquote>/g, function (match, key, settings, value) {
        const config = options[key.toLowerCase()];

        if (!config) {
          return match;
        }

        const style = findSetting(settings, 'style', options.style);
        let isIconVisible = findSetting(settings, 'iconVisibility', 'visible', (value) => value !== 'hidden');
        let isLabelVisible = findSetting(settings, 'labelVisibility', 'visible', (value) => value !== 'hidden');
        let label = findSetting(settings, 'label', config.label);
        const icon = findSetting(settings, 'icon', config.icon);
        const className = findSetting(settings, 'className', config.className);

        // Label can be language specific and could be specified via user configuration
        if (typeof label === 'object') {
          const foundLabel = Object.keys(label).filter(function (key) {
            return vm.route.path.indexOf(key) > -1;
          });

          if (foundLabel && foundLabel.length > 0) {
            label = label[foundLabel[0]];
          } else {
            isLabelVisible = false;
            isIconVisible = false;
          }
        }

        const iconTag = `<i class="${icon}"></i>`;

        return (
          `<div class="alert ${style} ${className}">
            <p class="title">
                ${isIconVisible ? iconTag : ''}
                ${isLabelVisible ? label : ''}
            </p>
            <p>${value}</p>
          </div>`
        );
      });

      next(modifiedHtml);
    });
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(install, window.$docsify.plugins);
}());
