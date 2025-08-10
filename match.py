import json
import os

# 定义必需字段
REQUIRED_FIELDS = {
    'symbol', 'englishName', 'chineseName', 'type', 'formula', 
    'molecularWeight', 'category', 'phase', 'color', 'odor', 
    'acidBase', 'state', 'description', 'discovery', 'origin',
    'funFacts', 'history'
}

def check_missing_fields(data):
    """检查每个条目缺少的字段"""
    missing = {}
    for item in data:
        name = item.get('chineseName', item.get('englishName', 'Unknown'))
        missing_fields = REQUIRED_FIELDS - set(item.keys())
        if missing_fields:
            missing[name] = missing_fields
    return missing

def save_to_markdown(missing_data, output_path):
    """将缺失字段保存为Markdown格式"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('# 缺失字段待办清单\n\n')
        for name, fields in missing_data.items():
            f.write(f'## {name}\n')
            for field in sorted(fields):
                f.write(f'- [ ] 添加 {field} 字段\n')
            f.write('\n')

def main():
    # 读取data.js文件
    data_file = os.path.join(os.path.dirname(__file__), 'data.js')
    with open(data_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取JSON数据部分
    # 这里假设数据在文件中的格式是: const data = [...];
    start = content.find('[')
    end = content.rfind(']') + 1
    json_str = content[start:end]
    
    try:
        data = json.loads(json_str)
        missing = check_missing_fields(data)
        
        # 保存结果
        output_path = os.path.join(os.path.dirname(__file__), 'todo.md')
        save_to_markdown(missing, output_path)
        print(f'已生成待办清单: {output_path}')
    except json.JSONDecodeError as e:
        print(f'解析JSON出错: {e}')

if __name__ == '__main__':
    main()